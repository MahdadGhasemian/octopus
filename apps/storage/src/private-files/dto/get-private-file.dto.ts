import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetPrivateFileDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  width?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  quality?: number;
}
