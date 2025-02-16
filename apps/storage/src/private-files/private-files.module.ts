import { Module } from '@nestjs/common';
import { PrivateFilesService } from './private-files.service';
import { PrivateFilesController } from './private-files.controller';
import { PrivateFilesRepository } from './private-files.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PrivateFile } from '../libs';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([PrivateFile])],
  controllers: [PrivateFilesController],
  providers: [PrivateFilesService, PrivateFilesRepository],
})
export class PrivateFilesModule {}
