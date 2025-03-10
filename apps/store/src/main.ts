import { NestFactory } from '@nestjs/core';
import { StoreModule } from './store.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(StoreModule);
  const configService = app.get(ConfigService);
  const documentOptions = new DocumentBuilder()
    .setTitle('Store App')
    .setDescription('Store Manager')
    .setVersion('1.0')
    .addServer(
      `http://localhost:${configService.getOrThrow<string>('HTTP_PORT_STORE')}`,
      'Local environment',
    )
    .addTag('Health')
    .addTag('Categories')
    .addTag('Products')
    .addTag('Orders')
    .addTag('Payments')
    .build();

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
      queue: configService.getOrThrow<string>('RABBITMQ_STORE_QUEUE_NAME'),
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

  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('docs', app, document);
  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT_STORE'));
}
bootstrap();
