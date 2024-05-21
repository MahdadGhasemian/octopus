import { ApiProperty } from '@nestjs/swagger';

export class UploadPublicFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: Express.Multer.File;
}
