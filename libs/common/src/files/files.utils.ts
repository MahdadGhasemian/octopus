import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

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
  if (
    !file.originalname ||
    !file.originalname.match(/\.(jpg|jpeg|png|webp)$/)
  ) {
    return callback(
      new BadRequestException(`File must be of type jpg|jpeg|png|webp`),
      false,
    );
  }

  return callback(null, true);
};
