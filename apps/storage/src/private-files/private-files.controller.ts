import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrivateFilesService } from './private-files.service';
import { Response } from 'express';
import { CurrentUser, JwtAuthAccessGuard } from '@app/common';
import { GetPrivateFileDto } from './dto/get-private-file.dto';
import { User } from '../libs';

@ApiTags('PrivateFiles')
@Controller('private-files')
export class PrivateFilesController {
  constructor(private readonly privateFilesService: PrivateFilesService) {}

  @Get(':bucket_name/:object_name')
  @UseGuards(JwtAuthAccessGuard)
  async downloadFile(
    @CurrentUser() user: User,
    @Param('bucket_name') bucket_name: string,
    @Param('object_name') object_name: string,
    @Query() query: GetPrivateFileDto,
    @Res() res: Response,
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
