import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { CreateOrderItemDto } from './create-order-items.dto';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrderDto {
  @IsDateString()
  @Field()
  order_date: Date;

  @IsArray()
  @Field()
  order_items: CreateOrderItemDto[];

  @IsString()
  @IsOptional()
  @Field()
  note?: string;
}
