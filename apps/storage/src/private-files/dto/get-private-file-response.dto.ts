import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UploadPrivateFileResponseDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @Expose()
  bucket_name: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @Expose()
  object_name: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Expose()
  size: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @Expose()
  url: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @Expose()
  description: string;
}
