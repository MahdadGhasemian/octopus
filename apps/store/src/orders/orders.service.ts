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

  async findAll(query: PaginateQuery, config: any, user: User) {
    return paginate(
      query,
      this.ordersRepository.entityRepository,
      getPaginationConfig(ORDER_PAGINATION_CONFIG, {
        identifierQuery: { user_id: user.id },
        config,
      }),
    );
  }

  async findOne(orderDto: GetOrderDto, user: User) {
    return this.ordersRepository.findOne({ ...orderDto, user_id: user.id });
  }

  async update(
    orderDto: GetOrderDto,
    updateOrderDto: UpdateOrderDto,
    user: User,
  ) {
    await this.checkOrderIsValidToEdit(orderDto, user);

    const updateData: UpdateOrderDto & { total_bill_amount?: number } = {
      ...updateOrderDto,
    };

    if (updateOrderDto.order_items) {
      const total_bill_amount = await this.calcualteTotalAmount(updateOrderDto);
      updateData.total_bill_amount = total_bill_amount;
    }

    const result = await this.ordersRepository.findOneAndUpdate(
      { ...orderDto, user_id: user.id },
      { ...updateData },
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

    await this.ordersRepository.findOneAndDelete({
      ...orderDto,
      user_id: user.id,
    });

    return order;
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

    return this.findOne({ id: order.id }, user);
  }

  async cancelOrder(orderDto: GetOrderDto, user: User) {
    await this.checkOrderIsValidToEdit(orderDto, user);

    const result = await this.ordersRepository.findOneAndUpdate(
      { ...orderDto, user_id: user.id },
      { order_status: OrderStatus.CANCELLED },
    );

    return this.findOne({ id: result.id }, user);
  }

  async getOrderItemsByOrderId(order_id: number) {
    const order = await this.ordersRepository.findOneNoCheck(
      { id: order_id },
      {
        order_items: true,
      },
    );

    return order?.order_items || [];
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
        createOrderDto.order_items?.map(async (item) => {
          const product = await this.productsService.findOne({
            id: item.product_id,
          });

          return { amount: item.quantity * product.sale_price };
        }),
      )
    ).reduce((acc, current) => acc + current.amount, 0);
  }
}
