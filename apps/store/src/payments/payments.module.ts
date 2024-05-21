import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, DatabaseModule } from '@app/common';
import { PaymentsRepository } from './payments.repository';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Payment]), OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
  exports: [PaymentsService],
})
export class PaymentsModule {}
