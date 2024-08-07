import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { GetOtpDto } from './dto/get-otp.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { AuthCommon, User } from '@app/common';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { EditInfoDto } from './dto/edit-info.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getOtp(getOtpDto: GetOtpDto) {
    const otp = this.generateUniqCode();
    const data_string = JSON.stringify({
      email: getOtpDto.email,
      otp,
    });

    const hashed_code = await AuthCommon.createHash(data_string);

    // TODO
    // Send OTP code via Email service
    // currrently we doen't have an email service, so the otp code will be printed as a log
    console.log({ otp });

    // Store OTP and Hashed_code in Redis with a TTL
    const ttl = this.configService.get('OTP_EMAIL_EXPIRATION');
    await this.cacheManager.set(getOtpDto.email, hashed_code, ttl);

    return { hashed_code };
  }

  async confirmOtp(confirmOtpDto: ConfirmOtpDto, response: Response) {
    // Retereve hashed_code from Redis
    const hashed_code = await this.cacheManager.get(confirmOtpDto.email);

    if (!hashed_code || hashed_code !== confirmOtpDto.hashed_code) {
      throw new UnauthorizedException(
        'OTP has already been used or is invalid',
      );
    }

    const data_string = JSON.stringify({
      email: confirmOtpDto.email,
      otp: confirmOtpDto.confirmation_code,
    });

    const isEqual = await AuthCommon.compareHash(
      confirmOtpDto.hashed_code,
      data_string,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    let user = await this.usersService.findOneNoCheck({
      email: confirmOtpDto.email,
    });

    // user is not already registered
    if (!user) {
      // new user
      const access_id = this.configService.get('DEFAULT_ACCESS_ID');
      user = await this.usersService.propareNewUser({
        email: confirmOtpDto.email,
        full_name: confirmOtpDto.full_name,
        password: confirmOtpDto.password,
        access_ids: [access_id],
      });
    }

    // Mark OTP as used by deleting it from Redis
    await this.cacheManager.del(confirmOtpDto.email);

    await this.authenticate(user, response);

    return user;
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    response: Response,
    user: User,
  ) {
    // Retereve hashed_code from Redis
    const hashed_code = await this.cacheManager.get(user.email);

    if (!hashed_code || hashed_code !== changePasswordDto.hashed_code) {
      throw new UnauthorizedException(
        'OTP has already been used or is invalid',
      );
    }

    const data_string = JSON.stringify({
      email: user.email,
      otp: changePasswordDto.confirmation_code,
    });

    const isEqual = await AuthCommon.compareHash(
      changePasswordDto.hashed_code,
      data_string,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    // update password
    await this.usersService.updatePassword(user.id, changePasswordDto.password);

    // Mark OTP as used by deleting it from Redis
    await this.cacheManager.del(user.email);

    await this.authenticate(user, response);

    return user;
  }

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.usersService.findOneNoCheck({
      email: loginDto.email,
    });

    const isEqual = await AuthCommon.compareHash(
      user.hashed_password,
      loginDto.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    await this.authenticate(user, response);

    return user;
  }

  async logout(response: Response) {
    return this.unauthenticate(response);
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersService.findOne({ email });

    const isEqual = await AuthCommon.compareHash(
      user.hashed_password,
      password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  async editInfo(editInfoDto: EditInfoDto, user: User) {
    const updatedUser = await this.usersService.update(user.id, editInfoDto);

    return updatedUser;
  }

  private generateUniqCode() {
    // random * (max - min) + min);
    return +Math.floor(Math.random() * 90000 + 10000);
  }

  private async authenticate(user: User, response: Response): Promise<string> {
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return token;
  }

  private async unauthenticate(response: Response): Promise<string> {
    response.cookie('Authentication', null);

    return null;
  }
}
