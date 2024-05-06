import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { IMAGE_PATH } from '@app/common';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        dest: IMAGE_PATH,
        limits: {
          fieldSize: configService.get<number>('UPLOAD_FILE_MAX_SIZE'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
