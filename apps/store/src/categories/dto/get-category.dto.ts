import { AbstractGetDto } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

@ObjectType()
export class GetCategoryDto extends AbstractGetDto {
  @IsNumber()
  @IsOptional()
  @Expose()
  @Field()
  id?: number;

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
}
