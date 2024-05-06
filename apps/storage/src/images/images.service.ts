import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IMAGE_PATH } from '@app/common';
import { UploadImageDto } from './dto/upload-image.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(file: Express.Multer.File, uploadImageDto: UploadImageDto) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const url = `${this.configService.get('BASE_URL_DOWNLOAD_IMAGES')}${file.filename}`;

    return {
      name: file.filename,
      size: file.size,
      url,
      description: uploadImageDto.description,
    };
  }

  async downloadImage(filename: string): Promise<string> {
    const imagePath = path.join(IMAGE_PATH, filename);

    return new Promise((resolve, reject) => {
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          reject('File not found');
        } else {
          resolve(imagePath);
        }
      });
    });
  }
}
