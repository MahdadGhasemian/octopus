import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @Field(() => String, { nullable: true })
  email?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  full_name?: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsOptional()
  @Field(() => [Int], { nullable: true })
  access_ids?: number[];
}
