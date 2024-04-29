import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Cateogry 1',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  image?: string;
}