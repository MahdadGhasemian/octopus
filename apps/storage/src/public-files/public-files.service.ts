import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import {
  downloadFileProcess,
  getBucketNameCache,
  getBucketNamePublic,
  getObjectName,
} from '../file/files.utils';
import { FileUpload } from 'graphql-upload-minimal';

@Injectable()
export class PublicFilesService {
  protected readonly logger = new Logger(PublicFilesService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
  ) {}

  async uploadFile(file: FileUpload) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // This file is now a Promise, so wait for it to resolve
    const { createReadStream, filename, mimetype } = await file;

    // Get the file buffer using the stream
    const fileBuffer = await this.streamToBuffer(createReadStream());

    const bucket_name = getBucketNamePublic(file.mimetype);
    const object_name = getObjectName(filename);

    return this.uploadObject(
      bucket_name,
      object_name,
      fileBuffer,
      fileBuffer.length,
      mimetype,
    );
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

  private async uploadObject(
    bucket_name: string,
    object_name: string,
    fileBuffer: Buffer,
    fileSize: number,
    mimetype: string,
  ) {
    // Upload file to MinIO
    await this.minioService.client.putObject(
      bucket_name,
      object_name,
      fileBuffer,
      fileSize,
      {
        'Content-Type': mimetype,
      },
    );

    // Generate file URL
    const url = `${this.configService.get('BASE_PUBLIC_URL_DOWNLOAD')}${bucket_name}/${object_name}`;

    return {
      bucket_name,
      object_name,
      size: fileSize,
      url,
    };
  }

  // Helper function to convert the stream to a buffer
  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
