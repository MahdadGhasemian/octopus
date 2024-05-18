import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IMAGE_PATH } from '@app/common';
import { UploadImageDto } from './dto/upload-image.dto';
import { ConfigService } from '@nestjs/config';
import Jimp from 'jimp';

const SUPPORTED_IMAGE_TO_RESIZE = ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'gif'];

@Injectable()
export class ImagesService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(file: Express.Multer.File, uploadImageDto: UploadImageDto) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const url = `${this.configService.get('BASE_URL_DOWNLOAD_IMAGES')}${file.filename}`;

    return {
      fileName: file.filename,
      size: file.size,
      url,
      description: uploadImageDto.description,
    };
  }

  async downloadImage(fileName: string, width: number, quality: number = 100) {
    const imagePath = path.join(IMAGE_PATH, fileName);
    const imageExt = path.extname(fileName).split('.').pop();

    // send original image
    if ((!width && !quality) || !SUPPORTED_IMAGE_TO_RESIZE.includes(imageExt)) {
      await fs.promises.access(imagePath, fs.constants.F_OK);
      return imagePath;
    }

    // send image from catch or create a new and then sending
    const imagePathInCache = this.cacheNamePattern(
      fileName,
      String(width),
      String(quality),
    );

    const cacheDir = path.join(`${this.configService.get('CACHE_IMAGE_PATH')}`);
    const cacheFullPath = path.join(cacheDir, imagePathInCache);

    try {
      await fs.promises.access(cacheFullPath, fs.constants.F_OK);

      // File exists, send cached image
      return cacheFullPath;
    } catch (err) {
      // File doesn't exist

      await fs.promises.access(imagePath, fs.constants.F_OK);

      //
      // make image and send
      await this.createFolderRecursive(cacheDir);

      // Cold resize image
      const cachedFile = await this.coldResize(
        imagePath,
        cacheFullPath,
        width,
        quality,
      );
      //

      return cachedFile;
    }
  }

  private cacheNamePattern(imageName: string, width: string, quality: string) {
    return 'w_' + width + '_q_' + quality + '_' + imageName;
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
