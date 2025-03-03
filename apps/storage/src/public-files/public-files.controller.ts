import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PublicFilesService } from './public-files.service';
import { FileTypeValidationPipe } from '@app/common';
import { UploadPublicFileDto } from './dto/upload-public-file.dto';
import { GetPublicFileDto } from './dto/get-public-file.dto';
import { UploadPublicFileResponseDto } from './dto/get-public-file-response.dto';
import { FastifyReply } from 'fastify';
import {
  FileInterceptor,
  MemoryStorageFile,
  UploadedFile,
} from '@blazity/nest-file-fastify';

@ApiTags('PublicFiles')
@Controller('public-files')
export class PublicFilesController {
  constructor(private readonly publicFilesService: PublicFilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadPublicFileDto,
  })
  @ApiOkResponse({
    type: UploadPublicFileResponseDto,
  })
  async uploadFile(
    @UploadedFile(new FileTypeValidationPipe()) file: MemoryStorageFile,
  ) {
    return this.publicFilesService.uploadFile(file);
  }

  @Get(':bucket_name/:object_name')
  async downloadFile(
    @Param('bucket_name') bucket_name: string,
    @Param('object_name') object_name: string,
    @Query() query: GetPublicFileDto,
    @Res() fastifyReply: FastifyReply,
  ) {
    try {
      const fileStream = await this.publicFilesService.downloadFile(
        bucket_name,
        object_name,
        query.width,
        query.quality,
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
