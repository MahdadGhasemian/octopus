import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payments.dto';
import { UpdatePaymentDto } from './dto/update-payments.dto';
import { Payment, PaymentStatus, User } from '@app/common';
import { PaymentsRepository } from './payments.repository';
import { GetPaymentDto } from './dto/get-payments.dto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly ordersService: OrdersService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, user: User) {
    console.log(createPaymentDto);
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
      user_id: user.id,
    });

    const result = await this.paymentsRepository.create(payment);

    return this.findOne({ id: result.id }, user);
  }

  async findAll(user: User) {
    return this.paymentsRepository.find({ user_id: user.id });
  }

  async findOne(paymentDto: GetPaymentDto, user: User) {
    return this.paymentsRepository.findOne(
      { ...paymentDto, user_id: user.id },
      {
        order: true,
      },
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
