import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  product_id: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  quantity: number;
}
