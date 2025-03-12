import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AbstractGetDto, OrderStatus } from '@app/common';
import { GetOrderItemDto } from './get-order-items.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetOrderDto extends AbstractGetDto {
  @IsNumber()
  @IsOptional()
  @Expose()
  @Field()
  id?: number;

  @IsDateString()
  @Expose()
  @Field()
  order_date?: Date;

  @IsString()
  @Type(() => GetOrderItemDto)
  @Expose()
  @Field()
  order_items?: GetOrderItemDto[];

  @IsNumber()
  @Expose()
  @Field()
  total_bill_amount?: number;

  @IsEnum(OrderStatus)
  @Expose()
  @Field()
  order_status?: OrderStatus;

  @IsBoolean()
  @Expose()
  @Field()
  is_paid?: boolean;

  @IsString()
  @IsOptional()
  @Expose()
  @Field()
  note?: string;
}
