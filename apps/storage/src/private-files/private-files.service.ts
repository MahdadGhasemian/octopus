import { ForbiddenException, Injectable, Logger } from '@nestjs/common';

import { UploadPrivateFileDto } from './dto/upload-private-file.dto';
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
import { MemoryStorageFile } from '@blazity/nest-file-fastify';

@Injectable()
export class PrivateFilesService {
  protected readonly logger = new Logger(PrivateFilesService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly privateFilesRepository: PrivateFilesRepository,
    private readonly minioService: MinioService,
  ) {}

  async uploadFile(
    file: MemoryStorageFile,
    uploadFileDto: UploadPrivateFileDto,
    user: User,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const bucket_name = getBucketNamePrivate(file.mimetype);
    const object_name = getObjectName();

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
    const url = `${this.configService.get('BASE_PRIVATE_URL_DOWNLOAD')}${bucket_name}/${object_name}`;

    const privateFile = new PrivateFile({
      object_name,
      bucket_name,
      url,
      description: uploadFileDto.description,
      user_id: user.id,
    });

    await this.privateFilesRepository.create(privateFile);

    return {
      bucket_name,
      object_name,
      size: file.size,
      url,
      description: uploadFileDto.description,
    };
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
}
