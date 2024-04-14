import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RoleDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  id?: number;

  @ApiProperty({
    example: 'admin',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose()
  name?: string;
}
