import { NestFactory } from '@nestjs/core';
import { StorageModule } from './storage.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import 'multer';

async function bootstrap() {
  const app = await NestFactory.create(StorageModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
      queue: configService.getOrThrow<string>('RABBITMQ_STORAGE_QUEUE_NAME'),
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT_STORAGE'));
}
bootstrap();
