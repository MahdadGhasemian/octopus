import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-items.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsDateString()
  order_date: Date;

  @ApiProperty({
    type: CreateOrderItemDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  order_items: CreateOrderItemDto[];

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}
