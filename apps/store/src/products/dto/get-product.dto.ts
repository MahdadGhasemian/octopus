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
import { GetCategoryDto } from '../../categories/dto/get-category.dto';
import { AbstractGetDto } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetProductDto extends AbstractGetDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  @Field()
  id?: number;

  @ApiProperty({
    example: 'Product 1',
    required: true,
  })
  @IsString()
  @Expose()
  @Field()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  @Field()
  description?: string;

  @ApiProperty({
    example: 'http://www.localhost/image1000.jpg',
    required: false,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  @Expose()
  @Field()
  image?: string;

  @IsNumber()
  @IsOptional()
  @Expose()
  @Field()
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
  @Field()
  price?: number;

  @ApiProperty({
    required: true,
    example: 47.5,
  })
  @IsNumber()
  @Expose()
  @Field()
  sale_price?: number;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @Expose()
  @Field()
  is_active?: boolean;
}
