import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Product 1',
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

  @IsNumber()
  @IsOptional()
  category_id?: number;

  @ApiProperty({
    required: true,
    example: 49,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    required: true,
    example: 47.5,
  })
  @IsNumber()
  sale_price: number;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  is_active?: boolean;
}
