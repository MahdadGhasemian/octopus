import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {
  DatabaseModule,
  GENERAL_SERVICE,
  KAFKA_AUTH_NAME,
  Role,
  User,
} from '@app/common';
import { UsersRepository } from './users.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([User, Role]),
    ClientsModule.registerAsync([
      {
        name: GENERAL_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: `${KAFKA_AUTH_NAME}`,
              brokers: [configService.getOrThrow<string>('KAFKA_BROKER_URI')],
            },
            consumer: {
              groupId: `${KAFKA_AUTH_NAME}-consumer`,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
