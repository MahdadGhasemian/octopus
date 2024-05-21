import { ForbiddenException, Injectable } from '@nestjs/common';

import { UploadPrivateFileDto } from './dto/upload-private-file.dto';
import { ConfigService } from '@nestjs/config';
import { prepareFilePath } from '../file/files.utils';
import { PrivateFile, User } from '@app/common';
import { PrivateFilesRepository } from './private-files.repository';

@Injectable()
export class PrivateFilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly privateFilesRepository: PrivateFilesRepository,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    uploadFileDto: UploadPrivateFileDto,
    user: User,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const url = `${this.configService.get('BASE_PRIVATE_URL_DOWNLOAD')}${file.filename}`;

    const privateFile = new PrivateFile({
      file_name: file.filename,
      url,
      description: uploadFileDto.description,
      user_id: user.id,
    });

    await this.privateFilesRepository.create(privateFile);

    return {
      fileName: file.filename,
      size: file.size,
      url,
      description: uploadFileDto.description,
    };
  }

  async downloadFile(
    fileName: string,
    width: number,
    quality: number,
    user: User,
  ) {
    const file = await this.privateFilesRepository.findOne({
      user_id: user.id,
      file_name: fileName,
    });

    if (!file) {
      throw new ForbiddenException('File Access Denied!');
    }

    const cachePath = this.configService.get('CACHE_IMAGE_PRIVATE_PATH');
    return prepareFilePath(fileName, width, quality, cachePath, true);
  }
}
