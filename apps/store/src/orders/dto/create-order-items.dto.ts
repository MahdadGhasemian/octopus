import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class CreateOrderItemDto {
  @IsNumber()
  @Field()
  product_id: number;

  @IsNumber()
  @Field()
  quantity: number;
}
