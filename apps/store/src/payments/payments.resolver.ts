import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../libs';
import { CurrentUser, JwtAuthAccessGuard, NoCache } from '@app/common';
import { PaymentsService } from './payments.service';
import { UseGuards } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetPaymentDto } from './dto/get-payment.dto';

@NoCache()
@Resolver(() => GetPaymentDto)
export class PaymetnsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Mutation(() => GetPaymentDto, { name: 'createPayment' })
  @UseGuards(JwtAuthAccessGuard)
  async create(
    @CurrentUser() user: User,
    @Args('createPaymentDto') createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(createPaymentDto, user);
  }
}
