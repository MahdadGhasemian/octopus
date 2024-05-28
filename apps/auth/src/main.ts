import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { KAFKA_AUTH_NAME } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const documentOptions = new DocumentBuilder()
    .setTitle('Auth App')
    .setDescription('Authentication Manager')
    .setVersion('1.0')
    .addServer(
      `http://localhost:${configService.getOrThrow<string>('HTTP_PORT_AUTH')}`,
      'Local environment',
    )
    // .addServer('https://staging.domain.com/', 'Staging')
    .addTag('Health')
    .addTag('Auth')
    .addTag('Users')
    .build();

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.getOrThrow<string>('KAFKA_BROKER_URI')],
      },
      consumer: {
        groupId: `${KAFKA_AUTH_NAME}-consumer`,
      },
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('docs', app, document);
  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT_AUTH'));
}
bootstrap();
