import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

@InputType()
export class CreateCategoryDto {
  @ApiProperty({
    example: 'Category 1',
    required: true,
  })
  @IsString()
  @Field(() => String)
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Field()
  description?: string;

  @ApiProperty({
    example: 'http://www.localhost/image1000.jpg',
    required: false,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  @Field()
  image?: string;
}
