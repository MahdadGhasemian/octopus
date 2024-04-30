import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  Payment,
  DatabaseModule,
  GENERAL_SERVICE,
  KAFKA_PRODUCTS_NAME,
} from '@app/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsRepository } from './payments.repository';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Payment]),
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
    OrdersModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
  exports: [PaymentsService],
})
export class PaymentsModule {}
