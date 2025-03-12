import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UploadPrivateFileResponseDto {
  @IsString()
  @Expose()
  bucket_name: string;

  @IsString()
  @Expose()
  object_name: string;

  @IsNumber()
  @Expose()
  size: number;

  @IsString()
  @Expose()
  url: string;

  @IsString()
  @Expose()
  description: string;
}
