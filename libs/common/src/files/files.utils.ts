import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import {
  COMPRESSED_PATH,
  DOCUMENT_PATH,
  IMAGE_PATH,
  MEDIA_PATH,
  SUPPORTED_COMPRESSED_FILES,
  SUPPORTED_DOCUMENTS,
  SUPPORTED_IMAGE,
  SUPPORTED_MEDIA_FILES,
} from '../constants';

export const fileName = (
  _req: Request,
  file: any,
  callback: (error: any, filename) => void,
) => {
  const ext = file?.originalname?.split('.')?.pop() || '.invalid';

  const newFileName = `${Date.now().toString()}_${Math.random().toString(36).substring(2, 10)}.${ext}`;

  return callback(null, newFileName);
};

export const imageFileFilter = (
  _req: Request,
  file: any,
  callback: (error: any, valid: boolean) => void,
) => {
  const ext = file?.originalname?.split('.')?.pop() || '.invalid';

  if (
    !file.originalname ||
    !(
      SUPPORTED_IMAGE.includes(ext) ||
      SUPPORTED_DOCUMENTS.includes(ext) ||
      SUPPORTED_MEDIA_FILES.includes(ext) ||
      SUPPORTED_COMPRESSED_FILES.includes(ext)
    )
  ) {
    return callback(
      new BadRequestException('File type is not supported'),
      false,
    );
  }

  return callback(null, true);
};

export const destination = (
  _req: Request,
  file: any,
  callback: (error: any, destination: string) => void,
) => {
  const ext = file?.originalname?.split('.')?.pop() || '.invalid';

  const basePath = SUPPORTED_IMAGE.includes(ext)
    ? IMAGE_PATH
    : SUPPORTED_DOCUMENTS.includes(ext)
      ? DOCUMENT_PATH
      : SUPPORTED_MEDIA_FILES.includes(ext)
        ? MEDIA_PATH
        : SUPPORTED_COMPRESSED_FILES.includes(ext)
          ? COMPRESSED_PATH
          : undefined;

  callback(null, basePath);
};
