import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-orders.dto';
import { UpdateOrderDto } from './dto/update-orders.dto';
import { Order, OrderItem, Product } from '@app/common';
import { OrdersRepository } from './orders.repository';
import { GetOrderDto } from './dto/get-orders.dto';
import { OrderItemsRepository } from './order-items.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = new Order({
      ...createOrderDto,
      order_items: createOrderDto.order_items.map((item) => {
        return new OrderItem({
          product: new Product({ id: item.product_id }),
          quantity: item.quantity,
        });
      }),
    });

    const result = await this.ordersRepository.create(order);

    return this.findOne({ id: result.id });
  }

  async findAll(orderDto: GetOrderDto) {
    return this.ordersRepository.find(orderDto);
  }

  async findOne(orderDto: GetOrderDto) {
    return this.ordersRepository.findOne(orderDto, {
      order_items: {
        product: {
          category: true,
        },
      },
    });
  }

  async update(orderDto: GetOrderDto, updateOrderDto: UpdateOrderDto) {
    return this.ordersRepository.findOneAndUpdate(orderDto, updateOrderDto);
  }

  async remove(orderDto: GetOrderDto) {
    return this.ordersRepository.findOneAndDelete(orderDto);
  }

  async clearItems(orderDto: GetOrderDto) {
    const order = await this.ordersRepository.findOne(orderDto, {
      order_items: true,
    });

    return Promise.all(
      order.order_items?.map(async (orderItem) => {
        await this.orderItemsRepository.findOneAndDelete({ id: orderItem.id });
      }),
    );
  }
}
