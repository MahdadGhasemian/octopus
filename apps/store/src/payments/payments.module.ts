import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsRepository } from './payments.repository';
import { OrdersModule } from '../orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Payment } from '../libs';
import { PaymetnsResolver } from './payments.resolver';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Payment]), OrdersModule],
  providers: [
    PaymetnsResolver,
    PaymentsService,
    PaymentsRepository,
    PaymetnsResolver,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
