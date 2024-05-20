import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  IMAGE_PATH,
  DOCUMENT_PATH,
  MEDIA_PATH,
  COMPRESSED_PATH,
  SUPPORTED_IMAGE,
  SUPPORTED_DOCUMENTS,
  SUPPORTED_MEDIA_FILES,
  SUPPORTED_COMPRESSED_FILES,
  SUPPORTED_IMAGE_TO_RESIZE,
} from '@app/common';
import { UploadFileDto } from './dto/upload-file.dto';
import { ConfigService } from '@nestjs/config';
import Jimp from 'jimp';

@Injectable()
export class PublicService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File, uploadFileDto: UploadFileDto) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const url = `${this.configService.get('BASE_URL_DOWNLOAD')}${file.filename}`;

    return {
      fileName: file.filename,
      size: file.size,
      url,
      description: uploadFileDto.description,
    };
  }

  async downloadFile(fileName: string, width: number, quality: number) {
    const fileExt = path.extname(fileName).split('.').pop();
    const isImageType = SUPPORTED_IMAGE.includes(fileExt);
    const isEditableImage = SUPPORTED_IMAGE_TO_RESIZE.includes(fileExt);

    const basePath = SUPPORTED_IMAGE.includes(fileExt)
      ? IMAGE_PATH
      : SUPPORTED_DOCUMENTS.includes(fileExt)
        ? DOCUMENT_PATH
        : SUPPORTED_MEDIA_FILES.includes(fileExt)
          ? MEDIA_PATH
          : SUPPORTED_COMPRESSED_FILES.includes(fileExt)
            ? COMPRESSED_PATH
            : undefined;

    if (!basePath) {
      throw new BadRequestException('File type is not correct!');
    }

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
    const imagePathInCache = this.cacheNamePattern(fileName, width, quality);

    const cacheDir = path.join(`${this.configService.get('CACHE_IMAGE_PATH')}`);
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
      await this.createFolderRecursive(cacheDir);

      // Cold resize image
      const cachedFile = await this.coldResize(
        filePath,
        cacheFullPath,
        width,
        quality,
      );
      //

      return cachedFile;
    }
  }

  private cacheNamePattern(imageName: string, width: number, quality: number) {
    return (
      (width ? 'w_' + width + '_' : '') +
      (quality ? 'q_' + quality + '_' : '') +
      imageName
    );
  }

  private createFolderRecursive(dirPath: string) {
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
  }

  private async coldResize(
    imagePath: string,
    outputPath: string,
    size: number,
    quality: number,
  ) {
    const image = await Jimp.read(imagePath);
    if (size) await image.resize(size, Jimp.AUTO);
    if (quality) await image.quality(quality);
    await image.writeAsync(outputPath);

    return outputPath;
  }
}
