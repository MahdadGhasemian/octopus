import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class GetImageDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  name?: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  size?: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsUrl()
  url?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
