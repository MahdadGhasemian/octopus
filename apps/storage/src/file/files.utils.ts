import { Request } from 'express';
import {
  COMPRESSED_PATH,
  COMPRESSED_PRIVATE_PATH,
  DOCUMENT_PATH,
  DOCUMENT_PRIVATE_PATH,
  IMAGE_PATH,
  IMAGE_PRIVATE_PATH,
  MEDIA_PATH,
  MEDIA_PRIVATE_PATH,
  MIME_TYPES,
  SUPPORTED_COMPRESSED_FILES,
  SUPPORTED_DOCUMENTS,
  SUPPORTED_IMAGE,
  SUPPORTED_IMAGE_TO_RESIZE,
  SUPPORTED_MEDIA_FILES,
} from '@app/common';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import Jimp from 'jimp';

export const fileName = (
  _req: Request,
  file: any,
  callback: (error: any, filename) => void,
) => {
  const ext = file?.originalname?.split('.')?.pop() || '.invalid';

  const newFileName = `${Date.now().toString()}_${Math.random().toString(36).substring(2, 10)}.${ext}`;

  return callback(null, newFileName);
};

export const publicDestination = (
  _req: Request,
  file: any,
  callback: (error: any, destination: string) => void,
) => {
  const mimetype = file.mimetype;

  const basePath = SUPPORTED_IMAGE.includes(mimetype)
    ? IMAGE_PATH
    : SUPPORTED_DOCUMENTS.includes(mimetype)
      ? DOCUMENT_PATH
      : SUPPORTED_MEDIA_FILES.includes(mimetype)
        ? MEDIA_PATH
        : SUPPORTED_COMPRESSED_FILES.includes(mimetype)
          ? COMPRESSED_PATH
          : undefined;

  callback(null, basePath);
};

export const privateDestination = (
  _req: Request,
  file: any,
  callback: (error: any, destination: string) => void,
) => {
  const mimetype = file.mimetype;

  const basePath = SUPPORTED_IMAGE.includes(mimetype)
    ? IMAGE_PRIVATE_PATH
    : SUPPORTED_DOCUMENTS.includes(mimetype)
      ? DOCUMENT_PRIVATE_PATH
      : SUPPORTED_MEDIA_FILES.includes(mimetype)
        ? MEDIA_PRIVATE_PATH
        : SUPPORTED_COMPRESSED_FILES.includes(mimetype)
          ? COMPRESSED_PRIVATE_PATH
          : undefined;

  callback(null, basePath);
};

export const getPublicBasePath = (fileName: string) => {
  const mimetype = MIME_TYPES[fileName.split('.').pop().toLowerCase()];
  const isImageType = SUPPORTED_IMAGE.includes(mimetype);
  const isEditableImage = SUPPORTED_IMAGE_TO_RESIZE.includes(mimetype);

  const basePath = SUPPORTED_IMAGE.includes(mimetype)
    ? IMAGE_PATH
    : SUPPORTED_DOCUMENTS.includes(mimetype)
      ? DOCUMENT_PATH
      : SUPPORTED_MEDIA_FILES.includes(mimetype)
        ? MEDIA_PATH
        : SUPPORTED_COMPRESSED_FILES.includes(mimetype)
          ? COMPRESSED_PATH
          : undefined;

  if (!basePath) {
    throw new BadRequestException('File type is not correct!');
  }

  return {
    isImageType,
    isEditableImage,
    basePath,
  };
};

export const getPrivateBasePath = (fileName: string) => {
  const mimetype = MIME_TYPES[fileName.split('.').pop().toLowerCase()];
  const isImageType = SUPPORTED_IMAGE.includes(mimetype);
  const isEditableImage = SUPPORTED_IMAGE_TO_RESIZE.includes(mimetype);

  const basePath = SUPPORTED_IMAGE.includes(mimetype)
    ? IMAGE_PRIVATE_PATH
    : SUPPORTED_DOCUMENTS.includes(mimetype)
      ? DOCUMENT_PRIVATE_PATH
      : SUPPORTED_MEDIA_FILES.includes(mimetype)
        ? MEDIA_PRIVATE_PATH
        : SUPPORTED_COMPRESSED_FILES.includes(mimetype)
          ? COMPRESSED_PRIVATE_PATH
          : undefined;

  if (!basePath) {
    throw new BadRequestException('File type is not correct!');
  }

  return {
    isImageType,
    isEditableImage,
    basePath,
  };
};

export const cacheNamePattern = (
  imageName: string,
  width: number,
  quality: number,
) => {
  return (
    (width ? 'w_' + width + '_' : '') +
    (quality ? 'q_' + quality + '_' : '') +
    imageName
  );
};

export const createFolderRecursive = async (dirPath: string) => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdir(dirPath, { recursive: true }, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      } else {
        resolve(true);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const coldResize = async (
  imagePath: string,
  outputPath: string,
  size: number,
  quality: number,
) => {
  const image = await Jimp.read(imagePath);
  if (size) await image.resize(size, Jimp.AUTO);
  if (quality) await image.quality(quality);
  await image.writeAsync(outputPath);

  return outputPath;
};

export const prepareFilePath = async (
  fileName: string,
  width: number,
  quality: number,
  cachePath: string,
  isPrivate: boolean = false,
) => {
  const { isImageType, isEditableImage, basePath } = isPrivate
    ? getPrivateBasePath(fileName)
    : getPublicBasePath(fileName);

  const filePath = path.join(basePath, fileName);

  // send original file
  if (
    !isImageType ||
    (isImageType && (!isEditableImage || (!width && !quality)))
  ) {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return filePath;
  }

  // send image from catch or create a new and then sending
  const imagePathInCache = cacheNamePattern(fileName, width, quality);

  const cacheDir = path.join(`${cachePath}`);
  const cacheFullPath = path.join(cacheDir, imagePathInCache);

  try {
    await fs.promises.access(cacheFullPath, fs.constants.F_OK);

    // File exists, send cached image
    return cacheFullPath;
  } catch (err) {
    // File doesn't exist

    await fs.promises.access(filePath, fs.constants.F_OK);

    //
    // make image and send
    await createFolderRecursive(cacheDir);

    // Cold resize image
    const cachedFile = await coldResize(
      filePath,
      cacheFullPath,
      width,
      quality,
    );
    //

    return cachedFile;
  }
};
