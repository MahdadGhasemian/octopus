import { Module } from '@nestjs/common';
import {
  AUTH_SERVICE,
  HealthModule,
  LoggerModule,
  RabbitmqModule,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PublicFilesModule } from './public-files/public-files.module';
import { PrivateFilesModule } from './private-files/private-files.module';
import * as Joi from 'joi';
import { MinioModule } from 'nestjs-minio-client';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_STORAGE: Joi.number().required(),
        UPLOAD_FILE_MAX_SIZE: Joi.number().required(),
        BASE_PUBLIC_URL_DOWNLOAD: Joi.string().required(),
        BASE_PRIVATE_URL_DOWNLOAD: Joi.string().required(),
        REDIS_CACHE_KEY_PREFIX_STORAGE: Joi.string().required(),
      }),
    }),
    RabbitmqModule.forRoot(AUTH_SERVICE, 'RABBITMQ_AUTH_QUEUE_NAME'),
    MinioModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.get<string>('MINIO_ENDPOINT'),
        port: parseInt(configService.get<string>('MINIO_PORT')),
        useSSL: configService.get<string>('MINIO_USE_SSL') === 'true',
        accessKey: configService.get<string>('MINIO_ACCESS_KEY'),
        secretKey: configService.get<string>('MINIO_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    PublicFilesModule,
    PrivateFilesModule,
  ],
  controllers: [],
})
export class StorageModule {}
