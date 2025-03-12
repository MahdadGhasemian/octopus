import { IsBoolean, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { OrderStatus } from '@app/common';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateIsPaidOrderDto {
  @IsEnum(OrderStatus)
  @Expose()
  @Field(() => OrderStatus)
  order_status?: OrderStatus;

  @IsBoolean()
  @Expose()
  @Field()
  is_paid?: boolean;
}
