import { Module } from '@nestjs/common';
import {
  GENERAL_SERVICE,
  HealthModule,
  KAFKA_STORAGE_NAME,
  LoggerModule,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ImagesModule } from './images/images.module';
import * as Joi from 'joi';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        UPLOAD_FILE_MAX_SIZE: Joi.number().required(),
        BASE_URL_DOWNLOAD_IMAGES: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: GENERAL_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: `${KAFKA_STORAGE_NAME}`,
              brokers: [configService.getOrThrow<string>('KAFKA_BROKER_URI')],
            },
            consumer: {
              groupId: `${KAFKA_STORAGE_NAME}-consumer`,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    HealthModule,
    ImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class StorageModule {}
