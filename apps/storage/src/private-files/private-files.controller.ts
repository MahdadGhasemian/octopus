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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PrivateFilesService } from './private-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import {
  CurrentUser,
  FileTypeValidationPipe,
  JwtAuthAccessGuard,
  User,
} from '@app/common';
import { UploadPrivateFileDto } from './dto/upload-private-file.dto';
import { GetPrivateFileDto } from './dto/get-private-file.dto';
import { UploadPrivateFileResponseDto } from './dto/get-private-file-response.dto';
import { privateDestination, fileName } from '../file/files.utils';

@ApiTags('PrivateFiles')
@Controller('private-files')
export class PrivateFilesController {
  constructor(private readonly privateFilesService: PrivateFilesService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: fileName,
        destination: privateDestination,
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadPrivateFileDto,
  })
  @ApiOkResponse({
    type: UploadPrivateFileResponseDto,
  })
  async uploadFile(
    @CurrentUser() user: User,
    @UploadedFile(new FileTypeValidationPipe())
    file: Express.Multer.File,
    @Body() uploadPrivateFileDto: UploadPrivateFileDto,
  ) {
    return this.privateFilesService.uploadFile(
      file,
      uploadPrivateFileDto,
      user,
    );
  }

  @Get(':fileName')
  @UseGuards(JwtAuthAccessGuard)
  async downloadFile(
    @CurrentUser() user: User,
    @Param('fileName') fileName: string,
    @Query() query: GetPrivateFileDto,
    @Res() res: Response,
  ) {
    try {
      const filePath = await this.privateFilesService.downloadFile(
        fileName,
        query.width,
        query.quality,
        user,
      );

      res.download(filePath);
    } catch (error) {
      throw new NotFoundException('File Not Found');
    }
  }
}
