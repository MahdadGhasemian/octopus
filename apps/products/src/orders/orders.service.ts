import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-orders.dto';
import { UpdateOrderDto } from './dto/update-orders.dto';
import { Order, OrderItem, OrderStatus, Product, User } from '@app/common';
import { OrdersRepository } from './orders.repository';
import { GetOrderDto } from './dto/get-orders.dto';
import { OrderItemsRepository } from './order-items.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const order = new Order({
      ...createOrderDto,
      order_items: createOrderDto.order_items.map((item) => {
        return new OrderItem({
          product: new Product({ id: item.product_id }),
          quantity: item.quantity,
        });
      }),
      order_status: OrderStatus.PENDING,
      user_id: user.id,
    });

    const result = await this.ordersRepository.create(order);

    return this.findOne({ id: result.id }, user);
  }

  async findAll(user: User) {
    return this.ordersRepository.find({ user_id: user.id });
  }

  async findOne(orderDto: GetOrderDto, user: User) {
    return this.ordersRepository.findOne(
      { ...orderDto, user_id: user.id },
      {
        order_items: {
          product: {
            category: true,
          },
        },
      },
    );
  }

  async update(
    orderDto: GetOrderDto,
    updateOrderDto: UpdateOrderDto,
    user: User,
  ) {
    await this.checkOrderIsValidToEdit(orderDto, user);

    const result = await this.ordersRepository.findOneAndUpdate(
      { ...orderDto, user_id: user.id },
      updateOrderDto,
    );

    return this.findOne({ id: result.id }, user);
  }

  async remove(orderDto: GetOrderDto, user: User) {
    await this.checkOrderIsValidToEdit(orderDto, user);

    return this.ordersRepository.findOneAndDelete({
      ...orderDto,
      user_id: user.id,
    });
  }

  async clearItems(orderDto: GetOrderDto, user: User) {
    await this.checkOrderIsValidToEdit(orderDto, user);

    const order = await this.ordersRepository.findOne(
      { ...orderDto, user_id: user.id },
      {
        order_items: true,
      },
    );

    return Promise.all(
      order.order_items?.map(async (orderItem) => {
        await this.orderItemsRepository.findOneAndDelete({ id: orderItem.id });
      }),
    );
  }

  async cancelOrder(orderDto: GetOrderDto, user: User) {
    await this.checkOrderIsValidToEdit(orderDto, user);

    const result = await this.ordersRepository.findOneAndUpdate(
      { ...orderDto, user_id: user.id },
      { order_status: OrderStatus.CANCELLED },
    );

    return this.findOne({ id: result.id }, user);
  }

  private async checkOrderIsValidToEdit(orderDto: GetOrderDto, user: User) {
    const order = await this.ordersRepository.findOne({
      ...orderDto,
      user_id: user.id,
    });

    if (order.order_status !== OrderStatus.PENDING) {
      throw new ForbiddenException(
        'This order is not on pending status, so you can not edited it.',
      );
    }
  }
}
