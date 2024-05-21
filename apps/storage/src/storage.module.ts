import { Module } from '@nestjs/common';
import {
  AUTH_SERVICE,
  HealthModule,
  KAFKA_STORAGE_NAME,
  KafkaModule,
  LoggerModule,
} from '@app/common';
import { ConfigModule } from '@nestjs/config';
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
    KafkaModule.forRoot(
      AUTH_SERVICE,
      `${KAFKA_STORAGE_NAME}`,
      `${KAFKA_STORAGE_NAME}-consumer`,
    ),
    HealthModule,
    PublicModule,
  ],
  controllers: [],
  providers: [],
})
export class StorageModule {}
