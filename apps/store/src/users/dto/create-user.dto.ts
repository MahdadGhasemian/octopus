import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsOptional()
  @Field()
  email?: string;

  @IsOptional()
  @Field()
  full_name?: string;
}
