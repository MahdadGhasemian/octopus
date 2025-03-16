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
import { CreateEndpointAccessDto } from './create-endpoint-access.dto';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAccessDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  title: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @Field()
  image?: string;

  @IsString()
  @IsHexColor()
  @IsOptional()
  @Field()
  color?: string;

  @IsBoolean()
  @Field()
  has_full_access: boolean;

  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @Field(() => [CreateEndpointAccessDto])
  endpoints?: CreateEndpointAccessDto[];
}
