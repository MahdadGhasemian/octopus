import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NoCache } from '../decorators';
import { MessageAckInterceptor } from '../interceptors';

@NoCache()
@Controller()
export class HealthController {
  @MessagePattern('rabbitmq.ping')
  @UseInterceptors(MessageAckInterceptor)
  pingHandler() {
    return 'pong';
  }
}
