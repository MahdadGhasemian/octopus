import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

@InputType()
export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @ApiProperty({
    example: 'http://www.localhost/image1000.jpg',
    required: false,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  @Field(() => String, { nullable: true })
  image?: string;
}
