import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class ChangePasswordDto {
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
