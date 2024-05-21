import { Module } from '@nestjs/common';
import { PrivateFilesService } from './private-files.service';
import { PrivateFilesController } from './private-files.controller';
import { DatabaseModule, PrivateFile } from '@app/common';
import { PrivateFilesRepository } from './private-files.repository';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([PrivateFile])],
  controllers: [PrivateFilesController],
  providers: [PrivateFilesService, PrivateFilesRepository],
})
export class PrivateFilesModule {}
