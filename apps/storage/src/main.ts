import { NestFactory } from '@nestjs/core';
import { StorageModule } from './storage.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { KAFKA_STORAGE_NAME } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(StorageModule);
  const configService = app.get(ConfigService);
  const documentOptions = new DocumentBuilder()
    .setTitle('Storage App')
    .setDescription('Storage Manager')
    .setVersion('1.0')
    .addServer(
      `http://localhost:${configService.getOrThrow<string>('HTTP_PORT')}`,
      'Local environment',
    )
    .addTag('Health')
    .addTag('PublicFiles')
    .addTag('PrivateFiles')
    .build();

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.getOrThrow<string>('KAFKA_BROKER_URI')],
      },
      consumer: {
        groupId: `${KAFKA_STORAGE_NAME}-consumer`,
      },
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('docs', app, document);
  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
