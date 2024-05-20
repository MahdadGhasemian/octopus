import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
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
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
