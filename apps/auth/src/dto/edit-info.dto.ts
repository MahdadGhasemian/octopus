import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditInfoDto {
  @ApiProperty({
    example: 'Mahdad Ghasemian',
    required: false,
  })
  @IsString()
  @IsOptional()
  full_name?: string;
}
