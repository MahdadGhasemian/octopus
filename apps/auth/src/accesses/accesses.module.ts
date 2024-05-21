import { Module } from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { AccessesController } from './accesses.controller';
import { Access, DatabaseModule, Endpoint } from '@app/common';
import { AccessesRepository } from './accesses.repository';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Access, Endpoint])],
  controllers: [AccessesController],
  providers: [AccessesService, AccessesRepository],
  exports: [AccessesService],
})
export class AccessesModule {}
