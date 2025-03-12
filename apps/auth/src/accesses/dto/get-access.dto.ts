import {
  IsArray,
  IsBoolean,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EndpointAccessDto } from './endpoint-access.dto';
import { Expose, Type } from 'class-transformer';
import { AbstractGetDto } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetAccessDto extends AbstractGetDto {
  @IsNumber()
  @IsOptional()
  @Expose()
  @Field()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @Field()
  title?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @Expose()
  @Field()
  image?: string;

  @IsString()
  @IsHexColor()
  @IsOptional()
  @Expose()
  @Field()
  color?: string;

  @IsBoolean()
  @Field()
  cannot_be_deleted?: boolean;

  @IsBoolean()
  @Expose()
  @Field()
  has_full_access?: boolean;

  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @Type(() => EndpointAccessDto)
  @Expose()
  endpoints?: EndpointAccessDto[];
}
