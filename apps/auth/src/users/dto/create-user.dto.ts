import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @IsString()
  @IsOptional()
  @Field()
  full_name?: string;

  @IsStrongPassword()
  @IsOptional()
  @Field()
  password?: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @Field(() => [Int])
  access_ids: number[];
}
