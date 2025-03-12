import { Module } from '@nestjs/common';
import { PublicFilesService } from './public-files.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { PublicFilesResolver } from './public-files.resolver';

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
  providers: [PublicFilesResolver, PublicFilesService],
})
export class PublicFilesModule {}
