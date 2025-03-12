import { Module } from '@nestjs/common';
import { PrivateFilesService } from './private-files.service';
import { PrivateFilesRepository } from './private-files.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PrivateFile } from '../libs';
import { PrivateFilesResolver } from './private-files.resolver';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([PrivateFile])],
  providers: [
    PrivateFilesResolver,
    PrivateFilesService,
    PrivateFilesRepository,
  ],
})
export class PrivateFilesModule {}
