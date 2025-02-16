import { Module } from '@nestjs/common';
import { PrivateFilesService } from './private-files.service';
import { PrivateFilesController } from './private-files.controller';
import { DatabaseModule } from '@app/common';
import { PrivateFilesRepository } from './private-files.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrivateFile } from '../libs';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_STORAGE'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([PrivateFile]),
  ],
  controllers: [PrivateFilesController],
  providers: [PrivateFilesService, PrivateFilesRepository],
})
export class PrivateFilesModule {}
