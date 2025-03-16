import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

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
}
