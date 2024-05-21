import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payments.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthAccessGuard, Serialize, User } from '@app/common';
import { GetPaymentDto } from './dto/get-payments.dto';

@ApiTags('Payments')
@Serialize(GetPaymentDto)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetPaymentDto,
  })
  async create(
    @CurrentUser() user: User,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(createPaymentDto, user);
  }
}
