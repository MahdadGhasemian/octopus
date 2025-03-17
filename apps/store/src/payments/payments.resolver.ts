import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../libs';
import { CurrentUser, JwtAuthAccessGuard, NoCache } from '@app/common';
import { PaymentsService } from './payments.service';
import { UseGuards } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetPaymentDto } from './dto/get-payment.dto';
import { GetOrderDto } from '../orders/dto/get-order.dto';

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

  @ResolveField(() => GetOrderDto, { name: 'order', nullable: true })
  async order(@Parent() payment: GetPaymentDto) {
    return this.paymentsService.getOrderByOrderId(payment.order_id);
  }
}
