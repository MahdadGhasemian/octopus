import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { OrderItemsRepository } from './order-items.repository';
import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Order, OrderItem } from '../libs';
import { OrdersResolver } from './orders.resolver';
import { OrderItemsResolver } from './order-items.resolver';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductsModule,
  ],
  providers: [
    OrdersResolver,
    OrdersService,
    OrdersRepository,
    OrderItemsRepository,
    OrderItemsResolver,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
