import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @IsStrongPassword()
  @IsOptional()
  @Field()
  password?: string;
}
