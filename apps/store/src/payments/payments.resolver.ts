import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Payment, User } from '../libs';
import { CurrentUser, JwtAuthAccessGuard, NoCache } from '@app/common';
import { PaymentsService } from './payments.service';
import { UseGuards } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

@NoCache()
@Resolver(() => Payment)
export class PaymetnsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Mutation(() => Payment, { name: 'createPayment' })
  @UseGuards(JwtAuthAccessGuard)
  async create(
    @CurrentUser() user: User,
    @Args('createPaymentDto') createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(createPaymentDto, user);
  }
}
