import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class GetOtpDto {
  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;
}
