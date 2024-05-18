import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { IMAGE_PATH, fileName, imageFileFilter } from '@app/common';
import { UploadImageDto } from './dto/upload-image.dto';
import { GetImageDto } from './dto/get-image.dto';
import { UploadImageResponseDto } from './dto/get-image-response.dto';

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
    type: UploadImageDto,
  })
  @ApiOkResponse({
    type: UploadImageResponseDto,
  })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadImageDto: UploadImageDto,
  ) {
    return this.imagesService.uploadImage(file, uploadImageDto);
  }

  @Get(':fileName')
  async downloadImage(
    @Param('fileName') fileName: string,
    @Query() query: GetImageDto,
    @Res() res: Response,
  ) {
    try {
      const imagePath = await this.imagesService.downloadImage(
        fileName,
        query.width,
        query.quality,
      );

      res.download(imagePath);
    } catch (error) {
      throw new NotFoundException('File Not Found');
    }
  }
}
