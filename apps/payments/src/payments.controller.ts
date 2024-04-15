import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserCreatedEvent } from '@app/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getHello(): string {
    return this.paymentsService.getHello();
  }

  @EventPattern('user_created')
  async userCreated(@Payload() data: UserCreatedEvent) {
    console.log({ stage: 'user_created payments', ...data });
  }
}
