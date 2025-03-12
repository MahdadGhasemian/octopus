import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class ConfirmOtpDto {
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

  @IsNumber()
  @IsNotEmpty()
  @Field()
  confirmation_code: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  hashed_code: string;
}
