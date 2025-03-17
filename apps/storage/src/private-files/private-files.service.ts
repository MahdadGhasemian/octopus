import { ForbiddenException, Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PrivateFilesRepository } from './private-files.repository';
import { MinioService } from 'nestjs-minio-client';
import {
  downloadFileProcess,
  getBucketNamePrivate,
  getBucketNamePrivateCache,
  getObjectName,
} from '../file/files.utils';
import { PrivateFile, User } from '../libs';
import { FileUpload } from 'graphql-upload-minimal';

@Injectable()
export class PrivateFilesService {
  protected readonly logger = new Logger(PrivateFilesService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly privateFilesRepository: PrivateFilesRepository,
    private readonly minioService: MinioService,
  ) {}

  async uploadFile(file: FileUpload, description: string, user: User) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // This file is now a Promise, so wait for it to resolve
    const { createReadStream, filename, mimetype } = await file;

    const bucket_name = getBucketNamePrivate(file.mimetype);
    const object_name = getObjectName(filename);

    // Get the file buffer using the stream
    const fileBuffer = await this.streamToBuffer(createReadStream());

    return this.uploadObject(
      bucket_name,
      object_name,
      fileBuffer,
      fileBuffer.length,
      mimetype,
      description,
      user.id,
    );
  }

  async downloadFile(
    bucket_name: string,
    object_name: string,
    width: number,
    quality: number,
    user: User,
  ) {
    const file = await this.privateFilesRepository.findOne({
      bucket_name,
      object_name,
      user_id: user.id,
    });

    if (!file) {
      throw new ForbiddenException('File Access Denied!');
    }

    const bucketCacheName = getBucketNamePrivateCache();

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
    description: string,
    user_id: number,
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
    const url = `${this.configService.get('BASE_PRIVATE_URL_DOWNLOAD')}${bucket_name}/${object_name}`;

    const privateFile = new PrivateFile({
      object_name,
      bucket_name,
      url,
      description,
      user_id,
    });

    await this.privateFilesRepository.create(privateFile);

    return {
      bucket_name,
      object_name,
      size: fileSize,
      url,
      description,
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
