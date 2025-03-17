import { Module } from '@nestjs/common';
import { PublicFilesService } from './public-files.service';
import { PublicFilesResolver } from './public-files.resolver';
import { PublicFilesController } from './public-files.controller';

@Module({
  controllers: [PublicFilesController],
  providers: [PublicFilesResolver, PublicFilesService],
})
export class PublicFilesModule {}
