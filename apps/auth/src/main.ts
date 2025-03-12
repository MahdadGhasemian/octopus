import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
      queue: configService.getOrThrow<string>('RABBITMQ_AUTH_QUEUE_NAME'),
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
  await app.listen(configService.get('HTTP_PORT_AUTH'));
}
bootstrap();
