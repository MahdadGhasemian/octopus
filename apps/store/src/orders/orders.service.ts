import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { getPaginationConfig, OrderStatus } from '@app/common';
import { OrdersRepository } from './orders.repository';
import { GetOrderDto } from './dto/get-order.dto';
import { OrderItemsRepository } from './order-items.repository';
import { ProductsService } from '../products/products.service';
import { UpdateIsPaidOrderDto } from './dto/update-paid-order.dto';
import { Order, OrderItem, Product, User } from '../libs';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { ORDER_PAGINATION_CONFIG } from './pagination-config';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const total_bill_amount = await this.calcualteTotalAmount(createOrderDto);

    const order = new Order({
      ...createOrderDto,
      order_items: createOrderDto.order_items.map((item) => {
        return new OrderItem({
          product: new Product({ id: item.product_id }),
          quantity: item.quantity,
        });
      }),
      total_bill_amount,
      order_status: OrderStatus.PENDING,
      user_id: user.id,
    });

    const result = await this.ordersRepository.create(order);

    return this.findOne({ id: result.id }, user);
  }

  async findAll(query: PaginateQuery, user: User) {
    return paginate(
      query,
      this.ordersRepository.entityRepository,
      getPaginationConfig(ORDER_PAGINATION_CONFIG, { user_id: user.id }),
    );
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
    const total_bill_amount = await this.calcualteTotalAmount(updateOrderDto);

    const result = await this.ordersRepository.findOneAndUpdate(
      { ...orderDto, user_id: user.id },
      { ...updateOrderDto, total_bill_amount },
    );

    return this.findOne({ id: result.id }, user);
  }

  async updateIsPaid(
    orderDto: GetOrderDto,
    updateOrderDto: UpdateIsPaidOrderDto,
    user: User,
  ) {
    return this.ordersRepository.findOneAndUpdate(
      { ...orderDto, user_id: user.id },
      updateOrderDto,
    );
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

    await Promise.all(
      order.order_items?.map(async (orderItem) => {
        await this.orderItemsRepository.findOneAndDelete({ id: orderItem.id });
      }),
    );

    await this.ordersRepository.findOneAndUpdate(
      { ...orderDto, user_id: user.id },
      { total_bill_amount: 0 },
    );

    return;
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
        'This order is not on pending status, so you can not edit it.',
      );
    }
  }

  private async calcualteTotalAmount(
    createOrderDto: CreateOrderDto | UpdateOrderDto,
  ) {
    return (
      await Promise.all(
        createOrderDto.order_items.map(async (item) => {
          const product = await this.productsService.findOne({
            id: item.product_id,
          });

          return { amount: item.quantity * product.sale_price };
        }),
      )
    ).reduce((acc, current) => acc + current.amount, 0);
  }
}
