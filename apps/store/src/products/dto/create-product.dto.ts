import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

@InputType()
export class CreateProductDto {
  @IsString()
  @Field()
  name: string;

  @IsString()
  @IsOptional()
  @Field()
  description?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @Field()
  image?: string;

  @IsNumber()
  @IsOptional()
  @Field(() => Int)
  category_id?: number;

  @IsNumber()
  @Field()
  price: number;

  @IsNumber()
  @Field()
  sale_price: number;

  @IsBoolean()
  @Field()
  is_active?: boolean;
}
