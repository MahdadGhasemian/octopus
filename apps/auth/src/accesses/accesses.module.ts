import { Module } from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { AccessesController } from './accesses.controller';
import { AccessesRepository } from './accesses.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Access, Endpoint } from '../libs';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Access, Endpoint])],
  controllers: [AccessesController],
  providers: [AccessesService, AccessesRepository],
  exports: [AccessesService],
})
export class AccessesModule {}
