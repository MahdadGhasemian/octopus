import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('/')
export class HealthController {
  @Get()
  health() {
    return true;
  }
}
