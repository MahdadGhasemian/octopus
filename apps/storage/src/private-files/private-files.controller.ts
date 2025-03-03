import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PrivateFilesService } from './private-files.service';
import { FastifyReply } from 'fastify';
import {
  CurrentUser,
  FileTypeValidationPipe,
  JwtAuthAccessGuard,
} from '@app/common';
import { UploadPrivateFileDto } from './dto/upload-private-file.dto';
import { GetPrivateFileDto } from './dto/get-private-file.dto';
import { UploadPrivateFileResponseDto } from './dto/get-private-file-response.dto';
import { User } from '../libs';
import {
  FileInterceptor,
  MemoryStorageFile,
  UploadedFile,
} from '@blazity/nest-file-fastify';

@ApiTags('PrivateFiles')
@Controller('private-files')
export class PrivateFilesController {
  constructor(private readonly privateFilesService: PrivateFilesService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadPrivateFileDto,
  })
  @ApiOkResponse({
    type: UploadPrivateFileResponseDto,
  })
  async uploadFile(
    @CurrentUser() user: User,
    @UploadedFile(new FileTypeValidationPipe()) file: MemoryStorageFile,
    @Body() uploadPrivateFileDto: UploadPrivateFileDto,
  ) {
    return this.privateFilesService.uploadFile(
      file,
      uploadPrivateFileDto,
      user,
    );
  }

  @Get(':bucket_name/:object_name')
  @UseGuards(JwtAuthAccessGuard)
  async downloadFile(
    @CurrentUser() user: User,
    @Param('bucket_name') bucket_name: string,
    @Param('object_name') object_name: string,
    @Query() query: GetPrivateFileDto,
    @Res() fastifyReply: FastifyReply,
  ) {
    try {
      const fileStream = await this.privateFilesService.downloadFile(
        bucket_name,
        object_name,
        query.width,
        query.quality,
        user,
      );

      // Set the appropriate headers to download the file
      fastifyReply.header(
        'Content-Disposition',
        `attachment; filename=${object_name}`,
      );

      // Pipe the stream to the response
      fileStream.pipe(fastifyReply.raw);
    } catch (error) {
      throw new NotFoundException('File Not Found');
    }
  }
}
