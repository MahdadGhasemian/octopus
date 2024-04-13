import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetOtpDto } from './dto/get-otp.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { Response } from 'express';
import { CurrentUser, User } from '@app/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { GetOtpResponseDto } from './dto/get-otp.response.dto';
import { GetUserDto } from './users/dto/get-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('otp')
  @ApiCreatedResponse({
    type: GetOtpResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getOtp(@Body() body: GetOtpDto) {
    return this.authService.getOtp(body);
  }

  @Post('otp/confirm')
  async confirmOtp(
    @Body() body: ConfirmOtpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.confirmOtp(body, response);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Body() _body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async getUser(@CurrentUser() user: User) {
    return user;
  }
}
