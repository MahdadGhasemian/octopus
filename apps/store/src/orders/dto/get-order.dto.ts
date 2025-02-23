import { ApiProperty } from '@nestjs/swagger';
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

export class GetOrderDto extends AbstractGetDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsDateString()
  @Expose()
  order_date?: Date;

  @ApiProperty({
    type: String,
    required: true,
    isArray: true,
  })
  @IsString()
  @Type(() => GetOrderItemDto)
  @Expose()
  order_items?: GetOrderItemDto[];

  @ApiProperty({
    example: 49,
    required: true,
  })
  @IsNumber()
  @Expose()
  total_bill_amount?: number;

  @ApiProperty({
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    required: true,
  })
  @IsEnum(OrderStatus)
  @Expose()
  order_status?: OrderStatus;

  @ApiProperty({
    example: true,
    required: true,
  })
  @IsBoolean()
  @Expose()
  is_paid?: boolean;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  note?: string;
}
