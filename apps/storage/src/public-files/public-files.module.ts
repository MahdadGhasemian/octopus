import { Module } from '@nestjs/common';
import { PublicFilesController } from './public-files.controller';
import { PublicFilesService } from './public-files.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        limits: {
          fieldSize: configService.get<number>('UPLOAD_FILE_MAX_SIZE'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PublicFilesController],
  providers: [PublicFilesService],
})
export class PublicFilesModule {}
