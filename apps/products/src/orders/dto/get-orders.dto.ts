import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateOrderItemDto } from './create-order-items.dto';

export class GetOrderDto {
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
  @Type(() => CreateOrderItemDto)
  @Expose()
  order_items?: CreateOrderItemDto[];

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  note?: string;
}
