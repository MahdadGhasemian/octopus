import { Module } from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { AccessesController } from './accesses.controller';
import { DatabaseModule } from '@app/common';
import { AccessesRepository } from './accesses.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Access, Endpoint } from '../libs';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_AUTH'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Access, Endpoint]),
  ],
  controllers: [AccessesController],
  providers: [AccessesService, AccessesRepository],
  exports: [AccessesService],
})
export class AccessesModule {}
