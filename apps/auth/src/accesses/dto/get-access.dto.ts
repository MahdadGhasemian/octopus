import {
  IsArray,
  IsBoolean,
  IsHexColor,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { AbstractGetDto } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { GetEndpointDto } from './get-endpoint.dto';

@ObjectType()
export class GetAccessDto extends AbstractGetDto {
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
  @Expose()
  @Field(() => Boolean)
  cannot_be_deleted?: boolean;

  @IsBoolean()
  @Expose()
  @Field()
  has_full_access?: boolean;

  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @Type(() => GetEndpointDto)
  @Expose()
  @Field(() => [GetEndpointDto])
  endpoints?: GetEndpointDto[];
}
