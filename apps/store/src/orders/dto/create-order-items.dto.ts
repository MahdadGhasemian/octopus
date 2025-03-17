import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class CreateOrderItemDto {
  @IsNumber()
  @Field(() => Int)
  product_id: number;

  @IsNumber()
  @Field(() => Int)
  quantity: number;
}
