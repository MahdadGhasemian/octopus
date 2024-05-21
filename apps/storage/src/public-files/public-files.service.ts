import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { prepareFilePath } from '../file/files.utils';

@Injectable()
export class PublicFilesService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const url = `${this.configService.get('BASE_PUBLIC_URL_DOWNLOAD')}${file.filename}`;

    return {
      fileName: file.filename,
      size: file.size,
      url,
    };
  }

  async downloadFile(fileName: string, width: number, quality: number) {
    const cachePath = this.configService.get('CACHE_IMAGE_PATH');
    return prepareFilePath(fileName, width, quality, cachePath);
  }
}
