import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { NoCache } from '../decorators';
import { MessageAckInterceptor } from '../interceptors';
import { HealthService } from './health.service';

@ApiTags('Health')
@NoCache()
@Controller('/')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async health() {
    const { status: rabbitStatus, responseTime } =
      await this.healthService.checkRabbit();

    return {
      status: rabbitStatus ? 'ok' : 'degraded',
      rabbitmq: rabbitStatus ? 'connected' : 'disconnected',
      responseTime: `${responseTime}ms`,
    };
  }

  @MessagePattern('rabbitmq.ping')
  @UseInterceptors(MessageAckInterceptor)
  pingHandler() {
    return 'pong';
  }
}
