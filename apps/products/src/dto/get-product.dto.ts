import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { GetCategoryDto } from '../categories/dto/get-category.dto';

export class GetProductDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    example: 'Product 1',
    required: true,
  })
  @IsString()
  @Expose()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  @Expose()
  image?: string;

  @IsNumber()
  @IsOptional()
  @Expose()
  category_id?: number;

  @IsObject()
  @IsOptional()
  @Type(() => GetCategoryDto)
  @Expose()
  category?: GetCategoryDto;

  @ApiProperty({
    required: true,
    example: 49,
  })
  @IsNumber()
  @Expose()
  price?: number;

  @ApiProperty({
    required: true,
    example: 47.5,
  })
  @IsNumber()
  @Expose()
  sale_price?: number;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @Expose()
  is_active?: boolean;
}
