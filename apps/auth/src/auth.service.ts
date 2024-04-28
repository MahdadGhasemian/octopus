import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { GetOtpDto } from './dto/get-otp.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { AuthCommon, Role, User } from '@app/common';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async getOtp(getOtpDto: GetOtpDto) {
    const otp = this.generateUniqCode();
    const data = JSON.stringify({
      email: getOtpDto.email,
      otp,
    });

    const hashed_code = await AuthCommon.createHash(data);

    // TODO
    // Send OTP code via Email service
    // currrently we doen't have an email service, so the otp code will be printed as a log
    console.log({ otp });

    return { hashed_code };
  }

  async confirmOtp(confirmOtpDto: ConfirmOtpDto, response: Response) {
    try {
      const data = JSON.stringify({
        email: confirmOtpDto.email,
        otp: confirmOtpDto.confirmation_code,
      });

      await AuthCommon.compareHash(confirmOtpDto.hashed_code, data);

      let hashed_password;

      if (confirmOtpDto?.password) {
        hashed_password = await AuthCommon.createHash(confirmOtpDto.password);
      }

      try {
        const user = await this.usersService.findOne({
          email: confirmOtpDto.email,
        });

        // user is already registered
        await this.usersService.update(user.id, hashed_password);
      } catch (error) {
        // new user
        const user = await this.usersService.create({
          email: confirmOtpDto.email,
          full_name: confirmOtpDto.full_name,
          // @ts-expect-error
          hashed_password,
          roles: ['user'],
        });

        await this.authenticate(user, response);
        return user;
      }
    } catch (error) {
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  async login(user: User, response: Response) {
    return this.authenticate(user, response);
  }

  async logout(response: Response) {
    return this.unauthenticate(response);
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersService.findOne({ email });
    try {
      await AuthCommon.compareHash(user.hashed_password, password);
    } catch (error) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  async changeRole(user: User) {
    return this.usersService.updateRole(user.id, { roles: ['user', 'admin'] });   
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
