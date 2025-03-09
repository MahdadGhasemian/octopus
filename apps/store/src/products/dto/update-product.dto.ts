import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

@InputType()
export class UpdateProductDto {
  @ApiProperty({
    example: 'Product 1',
    required: true,
  })
  @IsString()
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

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  category_id?: number;
}
