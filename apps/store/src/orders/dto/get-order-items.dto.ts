import { Expose, Type } from 'class-transformer';
import { IsNumber, IsObject } from 'class-validator';
import { GetProductDto } from '../../products/dto/get-product.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractGetDto } from '@app/common';

@ObjectType()
export class GetOrderItemDto extends AbstractGetDto {
  @IsNumber()
  @Expose()
  @Field()
  product_id: number;

  @IsObject()
  @Type(() => GetProductDto)
  @Expose()
  @Field(() => GetProductDto)
  product: GetProductDto;

  @IsNumber()
  @Expose()
  @Field()
  quantity: number;
}
