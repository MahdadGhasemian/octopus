import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicFilesService } from './public-files.service';
import { Response } from 'express';
import { GetPublicFileDto } from './dto/get-public-file.dto';

@ApiTags('PublicFiles')
@Controller('public-files')
export class PublicFilesController {
  constructor(private readonly publicFilesService: PublicFilesService) {}

  @Get(':bucket_name/:object_name')
  async downloadFile(
    @Param('bucket_name') bucket_name: string,
    @Param('object_name') object_name: string,
    @Query() query: GetPublicFileDto,
    @Res() res: Response,
  ) {
    try {
      const fileStream = await this.publicFilesService.downloadFile(
        bucket_name,
        object_name,
        query.width,
        query.quality,
      );

      // Set the appropriate headers to download the file
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${object_name}`,
      );

      // Pipe the stream to the response
      fileStream.pipe(res);
    } catch (error) {
      throw new NotFoundException('File Not Found');
    }
  }
}
