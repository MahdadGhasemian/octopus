import { Module } from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { AccessesResolver } from './accesses.resolver';
import { AccessesRepository } from './accesses.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Access, Endpoint } from '../libs';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Access, Endpoint])],
  providers: [AccessesResolver, AccessesService, AccessesRepository],
  exports: [AccessesService],
})
export class AccessesModule {}
