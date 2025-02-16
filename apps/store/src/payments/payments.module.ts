import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { DatabaseModule } from '@app/common';
import { PaymentsRepository } from './payments.repository';
import { OrdersModule } from '../orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Payment } from '../libs';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_STORE'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Payment]),
    OrdersModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
  exports: [PaymentsService],
})
export class PaymentsModule {}
