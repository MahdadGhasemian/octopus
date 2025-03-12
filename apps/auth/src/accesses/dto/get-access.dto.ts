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
import { GetEndpointAccessDto } from './get-endpoint-access.dto';
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
  @Type(() => GetEndpointAccessDto)
  @Expose()
  @Field(() => [GetEndpointAccessDto])
  endpoints?: GetEndpointAccessDto[];
}
