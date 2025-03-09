import { AbstractGetDto } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

@ObjectType()
export class GetCategoryDto extends AbstractGetDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  @Field()
  id?: number;

  @ApiProperty({
    example: 'Category 1',
    required: true,
  })
  @IsString()
  @Expose()
  @Field()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  @Field()
  description?: string;

  @ApiProperty({
    example: 'http://www.localhost/image1000.jpg',
    required: false,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  @Expose()
  @Field()
  image?: string;
}
