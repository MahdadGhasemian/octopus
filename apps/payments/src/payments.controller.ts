import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getHello(): string {
    return this.paymentsService.getHello();
  }
}
