import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetFileDto {
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  width?: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  quality?: number;
}
