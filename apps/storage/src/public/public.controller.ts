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
import { PublicService } from './public.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { destination, fileName, imageFileFilter } from '@app/common';
import { UploadFileDto } from './dto/upload-file.dto';
import { GetFileDto } from './dto/get-file.dto';
import { UploadFileResponseDto } from './dto/get-file-response.dto';

@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: fileName,
        destination: destination,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadFileDto,
  })
  @ApiOkResponse({
    type: UploadFileResponseDto,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
  ) {
    return this.publicService.uploadFile(file, uploadFileDto);
  }

  @Get(':fileName')
  async downloadFile(
    @Param('fileName') fileName: string,
    @Query() query: GetFileDto,
    @Res() res: Response,
  ) {
    try {
      const filePath = await this.publicService.downloadFile(
        fileName,
        query.width,
        query.quality,
      );

      res.download(filePath);
    } catch (error) {
      throw new NotFoundException('File Not Found');
    }
  }
}
