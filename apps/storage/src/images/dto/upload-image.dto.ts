import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: Express.Multer.File;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
