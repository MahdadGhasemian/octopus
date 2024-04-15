import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import {
  GENERAL_SERVICE,
  HealthModule,
  KAFKA_PRODUCTS_NAME,
  LoggerModule,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: GENERAL_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: `${KAFKA_PRODUCTS_NAME}`,
              brokers: [configService.getOrThrow<string>('KAFKA_BROKER_URI')],
            },
            consumer: {
              groupId: `${KAFKA_PRODUCTS_NAME}-consumer`,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    HealthModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
