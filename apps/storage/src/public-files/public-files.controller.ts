import {
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
import { PublicFilesService } from './public-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FileTypeValidationPipe } from '@app/common';
import { UploadPublicFileDto } from './dto/upload-public-file.dto';
import { GetPublicFileDto } from './dto/get-public-file.dto';
import { UploadPublicFileResponseDto } from './dto/get-public-file-response.dto';
import { publicDestination, fileName } from '../file/files.utils';

@ApiTags('PublicFiles')
@Controller('public-files')
export class PublicFilesController {
  constructor(private readonly publicFilesService: PublicFilesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: fileName,
        destination: publicDestination,
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadPublicFileDto,
  })
  @ApiOkResponse({
    type: UploadPublicFileResponseDto,
  })
  async uploadFile(
    @UploadedFile(new FileTypeValidationPipe())
    file: Express.Multer.File,
  ) {
    return this.publicFilesService.uploadFile(file);
  }

  @Get(':fileName')
  async downloadFile(
    @Param('fileName') fileName: string,
    @Query() query: GetPublicFileDto,
    @Res() res: Response,
  ) {
    try {
      const filePath = await this.publicFilesService.downloadFile(
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
