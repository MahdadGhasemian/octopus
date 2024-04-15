import { Controller, Get, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthRoleGuard, Roles } from '@app/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @UseGuards(JwtAuthRoleGuard)
  @Roles('admin')
  getHello(): string {
    return this.paymentsService.getHello();
  }
}
