import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule, User } from '@app/common';
import { UsersRepository } from './users.repository';
import { AccessesModule } from '../accesses/accesses.module';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([User]), AccessesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
