import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import {
  downloadFileProcess,
  getBucketNameCache,
  getBucketNamePublic,
  getObjectName,
} from '../file/files.utils';

@Injectable()
export class PublicFilesService {
  protected readonly logger = new Logger(PublicFilesService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const bucket_name = getBucketNamePublic(file.mimetype);
    const object_name = getObjectName(file.originalname);

    // Upload file to MinIO
    await this.minioService.client.putObject(
      bucket_name,
      object_name,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    // Generate file URL
    const url = `${this.configService.get('BASE_PUBLIC_URL_DOWNLOAD')}${bucket_name}/${object_name}`;

    return {
      bucket_name,
      object_name,
      size: file.size,
      url,
    };
  }

  async downloadFile(
    bucket_name: string,
    object_name: string,
    width: number,
    quality: number,
  ) {
    const bucketCacheName = getBucketNameCache();

    return downloadFileProcess(
      this.minioService.client,
      this.logger,
      bucketCacheName,
      bucket_name,
      object_name,
      width,
      quality,
    );
  }
}
