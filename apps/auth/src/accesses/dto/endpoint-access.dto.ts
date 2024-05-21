import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EndpointAccessDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Get users list',
  })
  @IsString()
  @IsOptional()
  @Expose()
  tag?: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '/auth/users',
  })
  @IsString()
  @Expose()
  path: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'GET',
  })
  @IsString()
  @Expose()
  method: string;
}
