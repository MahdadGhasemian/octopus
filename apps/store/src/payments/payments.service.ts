import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { OrderStatus, PaymentStatus } from '@app/common';
import { PaymentsRepository } from './payments.repository';
import { GetPaymentDto } from './dto/get-payment.dto';
import { OrdersService } from '../orders/orders.service';
import { Payment, User } from '../libs';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly ordersService: OrdersService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, user: User) {
    // Do a fake payment
    const order = await this.ordersService.findOne(
      {
        id: createPaymentDto.order_id,
      },
      user,
    );

    const payment = new Payment({
      ...createPaymentDto,
      amount: order.total_bill_amount,
      payment_status: PaymentStatus.PAID,
      paid_date: new Date(),
      user_id: user.id,
    });

    const paymentResult = await this.paymentsRepository.create(payment);
    await this.ordersService.updateIsPaid(
      { id: order.id },
      { order_status: OrderStatus.PAID, is_paid: true },
      user,
    );

    return this.findOne({ id: paymentResult.id }, user);
  }

  async findAll(user: User) {
    return this.paymentsRepository.find({ user_id: user.id });
  }

  async findOne(paymentDto: GetPaymentDto, user: User) {
    return this.paymentsRepository.findOne(
      { ...paymentDto, user_id: user.id },
      // {
      //   order: true,
      // },
    );
  }

  async update(
    paymentDto: GetPaymentDto,
    updatePaymentDto: UpdatePaymentDto,
    user: User,
  ) {
    await this.checkPaymentIsValidToEdit(paymentDto, user);

    const result = await this.paymentsRepository.findOneAndUpdate(
      { ...paymentDto, user_id: user.id },
      updatePaymentDto,
    );

    return this.findOne({ id: result.id }, user);
  }

  async remove(paymentDto: GetPaymentDto, user: User) {
    await this.checkPaymentIsValidToEdit(paymentDto, user);

    return this.paymentsRepository.findOneAndDelete({
      ...paymentDto,
      user_id: user.id,
    });
  }

  async getOrderByOrderId(order_id: number) {
    const payment = await this.paymentsRepository.findOneNoCheck(
      { order_id },
      {
        order: true,
      },
    );

    return payment?.order;
  }

  private async checkPaymentIsValidToEdit(
    paymentDto: GetPaymentDto,
    user: User,
  ) {
    const payment = await this.paymentsRepository.findOne({
      ...paymentDto,
      user_id: user.id,
    });

    if (payment.payment_status !== PaymentStatus.PENDING) {
      throw new ForbiddenException(
        'This payment is not on pending status, so you can not edit it.',
      );
    }
  }
}
