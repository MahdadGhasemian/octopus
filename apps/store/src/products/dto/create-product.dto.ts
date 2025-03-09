import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

@InputType()
export class CreateProductDto {
  @ApiProperty({
    example: 'Product 1',
    required: true,
  })
  @IsString()
  @Field()
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Field()
  description?: string;

  @ApiProperty({
    example: 'http://www.localhost/image1000.jpg',
    required: false,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  @Field()
  image?: string;

  @IsNumber()
  @IsOptional()
  @Field()
  category_id?: number;

  @ApiProperty({
    required: true,
    example: 49,
  })
  @IsNumber()
  @Field()
  price: number;

  @ApiProperty({
    required: true,
    example: 47.5,
  })
  @IsNumber()
  @Field()
  sale_price: number;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @Field()
  is_active?: boolean;
}
