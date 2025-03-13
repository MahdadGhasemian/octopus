import { Module } from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { AccessesResolver } from './accesses.resolver';
import { AccessesRepository } from './accesses.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Access, Endpoint } from '../libs';
import { EndpointsRepository } from './endpoints.repository';
import { EndpointsService } from './endpoints.service';
import { EndpointsResolver } from './endpoints.resolver';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Access, Endpoint])],
  providers: [
    AccessesResolver,
    AccessesService,
    AccessesRepository,
    EndpointsResolver,
    EndpointsService,
    EndpointsRepository,
  ],
  exports: [AccessesService],
})
export class AccessesModule {}
