import { Module } from '@nestjs/common';
import {
  AUTH_SERVICE,
  HealthModule,
  KAFKA_STORE_NAME,
  KafkaModule,
  LoggerModule,
} from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
      }),
    }),
    KafkaModule.forRoot(
      AUTH_SERVICE,
      `${KAFKA_STORE_NAME}`,
      `${KAFKA_STORE_NAME}-consumer`,
    ),
    HealthModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
  ],
})
export class StoreModule {}
