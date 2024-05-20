import { Module } from '@nestjs/common';
import {
  GENERAL_SERVICE,
  HealthModule,
  KAFKA_STORAGE_NAME,
  LoggerModule,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PublicModule } from './public/public.module';
import * as Joi from 'joi';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        UPLOAD_FILE_MAX_SIZE: Joi.number().required(),
        BASE_URL_DOWNLOAD: Joi.string().required(),
        IMAGE_PATH: Joi.string().required(),
        DOCUMENT_PATH: Joi.string().required(),
        MEDIA_PATH: Joi.string().required(),
        COMPRESSED_PATH: Joi.string().required(),
        CACHE_IMAGE_PATH: Joi.string().required(),
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
    PublicModule,
  ],
  controllers: [],
  providers: [],
})
export class StorageModule {}
