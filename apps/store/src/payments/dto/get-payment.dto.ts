import { Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { AbstractGetDto, PaymentStatus } from '@app/common';
import { GetOrderDto } from '../../orders/dto/get-order.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetPaymentDto extends AbstractGetDto {
  @IsNumber()
  @IsOptional()
  @Expose()
  @Field()
  id?: number;

  @IsNumber()
  @Expose()
  @Field()
  amount?: number;

  @IsDateString()
  @Expose()
  @Field()
  paid_date?: Date;

  @IsEnum(PaymentStatus)
  @Expose()
  @Field()
  payment_status?: PaymentStatus;

  @IsObject()
  @Type(() => GetOrderDto)
  @Expose()
  @Field()
  order?: GetOrderDto;

  @IsString()
  @IsOptional()
  @Expose()
  @Field()
  note?: string;
}
