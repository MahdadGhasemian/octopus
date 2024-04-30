import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  Category,
  DatabaseModule,
  GENERAL_SERVICE,
  KAFKA_STORE_NAME,
} from '@app/common';
import { ConfigService } from '@nestjs/config';
import { CategoriesRepository } from './categories.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Category]),
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
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
