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
  @IsString()
  @Expose()
  @Field()
  name?: string;

  @IsString()
  @IsOptional()
  @Expose()
  @Field()
  description?: string;

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
  @Field(() => GetCategoryDto, { nullable: true })
  category?: GetCategoryDto;

  @IsNumber()
  @Expose()
  @Field()
  price?: number;

  @IsNumber()
  @Expose()
  @Field()
  sale_price?: number;

  @IsBoolean()
  @Expose()
  @Field()
  is_active?: boolean;
}
