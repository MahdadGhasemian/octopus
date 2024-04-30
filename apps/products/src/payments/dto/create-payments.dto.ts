import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsNumber()
  order_id: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
