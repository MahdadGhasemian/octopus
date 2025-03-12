import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

@InputType()
export class UpdateProductDto {
  @IsString()
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

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  category_id?: number;
}
