import { Module } from '@nestjs/common';
import { PublicFilesController } from './public-files.controller';
import { PublicFilesService } from './public-files.service';

@Module({
  imports: [],
  controllers: [PublicFilesController],
  providers: [PublicFilesService],
})
export class PublicFilesModule {}
