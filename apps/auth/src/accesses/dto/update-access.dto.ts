import { Field, InputType } from '@nestjs/graphql';
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

@InputType()
export class UpdateAccessDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Field(() => String, { nullable: true })
  title?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @Field(() => String, { nullable: true })
  image?: string;

  @IsString()
  @IsHexColor()
  @IsOptional()
  @Field(() => String, { nullable: true })
  color?: string;

  @IsBoolean()
  @IsOptional()
  @Field(() => String, { nullable: true })
  has_full_access?: boolean;

  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @Field(() => [CreateEndpointAccessDto], { nullable: true })
  endpoints: CreateEndpointAccessDto[];
}
