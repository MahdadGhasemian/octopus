import { Controller, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  EVENT_NAME_USER_CREATED,
  EVENT_NAME_USER_UPDATED,
  MessageAckInterceptor,
  UserCreatedEvent,
  UserUpdatedEvent,
} from '@app/common';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @EventPattern(EVENT_NAME_USER_CREATED)
  @UseInterceptors(MessageAckInterceptor)
  async userCreated(@Payload() payload: UserCreatedEvent) {
    const { user } = payload;

    // create user
    await this.usersService.create(user);
  }

  @EventPattern(EVENT_NAME_USER_UPDATED)
  @UseInterceptors(MessageAckInterceptor)
  async userUpdated(@Payload() payload: UserUpdatedEvent) {
    // update user
    await this.usersService.update(payload.user.id, payload.user);
  }
}
