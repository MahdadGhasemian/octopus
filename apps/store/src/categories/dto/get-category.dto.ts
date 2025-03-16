import { AbstractGetDto } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { GetProductDto } from '../../products/dto/get-product.dto';

@ObjectType()
export class GetCategoryDto extends AbstractGetDto {
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

  @Field(() => [GetProductDto], { nullable: true })
  products?: GetProductDto[];
}
