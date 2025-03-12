import { Expose } from 'class-transformer';
import { IsNumber, IsString, IsUrl } from 'class-validator';

export class UploadPublicFileResponseDto {
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
  @IsUrl()
  @Expose()
  url: string;
}
