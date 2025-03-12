import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl } from 'class-validator';

@InputType()
export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @Field(() => String, { nullable: true })
  image?: string;
}
