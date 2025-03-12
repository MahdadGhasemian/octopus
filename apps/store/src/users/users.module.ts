import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../libs';
import { UsersController } from './users.controller';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_STORE'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
