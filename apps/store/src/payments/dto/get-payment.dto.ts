import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Order, PaymentStatus } from '@app/common';
import { GetOrderDto } from '../../orders/dto/get-order.dto';

export class GetPaymentDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    example: 49,
    required: true,
  })
  @IsNumber()
  @Expose()
  amount?: number;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsDateString()
  @Expose()
  paid_date?: Date;

  @ApiProperty({
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    required: true,
  })
  @IsEnum(PaymentStatus)
  @Expose()
  payment_status?: PaymentStatus;

  @IsObject()
  @Type(() => GetOrderDto)
  @Expose()
  order?: Order;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  note?: string;
}
