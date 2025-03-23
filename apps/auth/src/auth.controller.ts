import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetOtpDto } from './dto/get-otp.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { Response } from 'express';
import {
  CurrentUser,
  EVENT_NAME_AUTHENTICATE_AND_CHECK_ACCESS,
  MessageAckInterceptor,
  NoCache,
} from '@app/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetOtpResponseDto } from './dto/get-otp.response.dto';
import { GetUserDto } from './users/dto/get-user.dto';
import { Serialize } from './users/interceptors/serialize.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EditInfoDto } from './dto/edit-info.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './libs';
import { JwtAccessGuard } from './guards/jwt-access.guard';

@ApiTags('Auth')
@NoCache()
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
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async confirmOtp(
    @Body() body: ConfirmOtpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.confirmOtp(body, response);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async changePassowrd(
    @CurrentUser() user: User,
    @Body() body: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.changePassword(body, response, user);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    this.authService.logout(response);
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  @Patch('info')
  @UseGuards(JwtAuthGuard)
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async editInfo(@CurrentUser() user: User, @Body() editInfoDto: EditInfoDto) {
    return this.authService.editInfo(editInfoDto, user);
  }

  @MessagePattern(EVENT_NAME_AUTHENTICATE_AND_CHECK_ACCESS)
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  @UseInterceptors(MessageAckInterceptor)
  async checkAccess(
    @Payload() data: { user: GetUserDto; path: string; method: string },
  ) {
    return data.user;
  }
}
