import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl } from 'class-validator';

@InputType()
export class CreateCategoryDto {
  @IsString()
  @Field(() => String)
  name: string;

  @IsString()
  @IsOptional()
  @Field()
  description?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @Field()
  image?: string;
}
