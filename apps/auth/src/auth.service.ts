import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { SignupDto } from './dto/signup.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { GetOtpDto } from './dto/get-otp.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { User } from '@app/common';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

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

    const salt = randomBytes(10).toString('hex');
    const hash = (await scrypt(data, salt, 32)) as Buffer;
    const hashed_code = salt + '.' + hash.toString('hex');

    // TODO
    // Send OTP code via Email service
    // currrently we doen't have an email service, so the otp code will be printed as a log
    console.log({ otp });

    return { hashed_code };
  }

  async confirmOtp(confirmOtpDto: ConfirmOtpDto, response: Response) {
    const [salt, storedHash] = confirmOtpDto.hashed_code.split('.');

    const data = JSON.stringify({
      email: confirmOtpDto.email,
      otp: confirmOtpDto.confirmation_code,
    });
    const hash = (await scrypt(data, salt, 32)) as Buffer;

    if (storedHash === hash.toString('hex')) {
      let hashed_password;

      if (confirmOtpDto?.password) {
        const salt = randomBytes(10).toString('hex');
        const hash = (await scrypt(confirmOtpDto.password, salt, 32)) as Buffer;
        hashed_password = salt + '.' + hash.toString('hex');
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
          hashed_password,
        });

        await this.authenticate(user, response);
        return user;
      }
    } else {
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

    const [salt, storedHash] = user.hashed_password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash === hash.toString('hex')) {
      return user;
    } else {
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  private generateUniqCode() {
    // random * (max - min) + min);
    return +Math.floor(Math.random() * 90000 + 10000);
  }

  private async validateSingup(signupDto: SignupDto) {
    try {
      await this.usersService.findOne({ email: signupDto.email });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists!');
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
