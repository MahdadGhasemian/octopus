import { IsOptional, IsString } from 'class-validator';

export class UploadPrivateFileDto {
  // file: Express.Multer.File;

  @IsString()
  @IsOptional()
  description?: string;
}
