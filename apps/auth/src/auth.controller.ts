import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  EVENT_NAME_AUTHENTICATE_AND_CHECK_ACCESS,
  MessageAckInterceptor,
  NoCache,
} from '@app/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUserDto } from './users/dto/get-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAccessGuard } from './guards/jwt-access.guard';

@NoCache()
@Controller()
export class AuthController {
  @MessagePattern(EVENT_NAME_AUTHENTICATE_AND_CHECK_ACCESS)
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  @UseInterceptors(MessageAckInterceptor)
  async checkAccess(
    @Payload() data: { user: GetUserDto; path: string; method: string },
  ) {
    return data.user;
  }
}
