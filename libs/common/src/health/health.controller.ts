import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { NoCache } from '../decorators';
import { MessageAckInterceptor, Serialize } from '../interceptors';
import { HealthService } from './health.service';
import { GetHealthDto } from './dto/get-health.dto';

@ApiTags('Health')
@NoCache()
@Controller('/')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Serialize(GetHealthDto)
  @ApiOkResponse({
    type: GetHealthDto,
  })
  async health() {
    return this.healthService.checkAll();
  }

  @MessagePattern('rabbitmq.ping')
  @UseInterceptors(MessageAckInterceptor)
  pingHandler() {
    return 'pong';
  }
}
