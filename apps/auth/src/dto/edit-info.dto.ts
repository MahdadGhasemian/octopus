import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class EditInfoDto {
  @IsString()
  @IsOptional()
  @Field()
  full_name?: string;
}
