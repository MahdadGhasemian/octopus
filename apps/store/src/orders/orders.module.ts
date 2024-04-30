import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  Order,
  DatabaseModule,
  GENERAL_SERVICE,
  KAFKA_STORE_NAME,
  OrderItem,
} from '@app/common';
import { ConfigService } from '@nestjs/config';
import { OrdersRepository } from './orders.repository';
import { OrderItemsRepository } from './order-items.repository';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Order, OrderItem]),
    ClientsModule.registerAsync([
      {
        name: GENERAL_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: `${KAFKA_STORE_NAME}`,
              brokers: [configService.getOrThrow<string>('KAFKA_BROKER_URI')],
            },
            consumer: {
              groupId: `${KAFKA_STORE_NAME}-consumer`,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, OrderItemsRepository],
  exports: [OrdersService],
})
export class OrdersModule {}
