import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsObject } from 'class-validator';
import { GetProductDto } from '../../products/dto/get-product.dto';

export class GetOrderItemDto {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @Expose()
  product_id: number;

  @IsObject()
  @Type(() => GetProductDto)
  @Expose()
  product: GetProductDto;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Expose()
  quantity: number;
}
