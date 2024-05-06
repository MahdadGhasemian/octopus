import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { diskStorage } from 'multer';
import { IMAGE_PATH, fileName, imageFileFilter } from '@app/common';
import { UploadImageDto } from './dto/upload-image.dto';
import { GetImageDto } from './dto/get-image.dto';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: fileName,
        destination: IMAGE_PATH,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: UploadImageDto,
  })
  @ApiOkResponse({
    type: GetImageDto,
  })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadImageDto: UploadImageDto,
  ) {
    return this.imagesService.uploadImage(file, uploadImageDto);
  }

  @Get(':filename')
  async downloadImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const imagePath = await this.imagesService.downloadImage(filename);

      res.download(imagePath);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
