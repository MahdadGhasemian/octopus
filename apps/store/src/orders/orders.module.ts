import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { OrderItemsRepository } from './order-items.repository';
import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Order, OrderItem } from '../libs';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductsModule,
  ],
  providers: [OrdersService, OrdersRepository, OrderItemsRepository],
  exports: [OrdersService],
})
export class OrdersModule {}
