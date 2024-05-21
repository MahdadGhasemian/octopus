import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl } from 'class-validator';

export class UploadPublicFileResponseDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  size: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsUrl()
  url: string;
}
