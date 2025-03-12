import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { AccessesModule } from '../accesses/accesses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../libs';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User]), AccessesModule],
  providers: [UsersResolver, UsersService, UsersRepository, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
