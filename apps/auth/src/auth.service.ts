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

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async getOtp(getOtpDto: GetOtpDto) {
    const otp = this.generateUniqCode();
    const data = JSON.stringify({
      email: getOtpDto.email,
      otp,
    });

    const salt = randomBytes(10).toString('hex');
    const hash = (await scrypt(data, salt, 32)) as Buffer;
    const temp_token = salt + '.' + hash.toString('hex');

    // TODO
    // Send OTP code via Email service
    // currrently we doen't have an email service, so the otp code will be printed as a log
    console.log({ otp });

    return { temp_token };
  }

  async confirmOtp(confirmOtpDto: ConfirmOtpDto) {
    const [salt, storedHash] = confirmOtpDto.temp_token.split('.');

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

        console.log(user);
      }
    } else {
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  async signup(signupDto: SignupDto) {
    await this.validateSingup(signupDto);

    const salt = randomBytes(10).toString('hex');
    const hash = (await scrypt(signupDto.password, salt, 32)) as Buffer;
    const hashed_password = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create({
      email: signupDto.email,
      hashed_password,
    });

    return user;
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
}
