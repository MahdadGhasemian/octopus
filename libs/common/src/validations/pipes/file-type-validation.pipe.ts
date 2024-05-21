import {
  SUPPORTED_COMPRESSED_FILES,
  SUPPORTED_DOCUMENTS,
  SUPPORTED_IMAGE,
  SUPPORTED_MEDIA_FILES,
} from '@app/common/constants';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  transform(file: any) {
    const allowedMimeTypes = SUPPORTED_IMAGE.concat(
      SUPPORTED_DOCUMENTS,
      SUPPORTED_MEDIA_FILES,
      SUPPORTED_COMPRESSED_FILES,
    );

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type 1');
    }
    return file;
  }
}
