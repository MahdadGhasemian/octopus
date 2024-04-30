import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { OrderStatus } from '@app/common';

export class UpdateIsPaidOrderDto {
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
}
