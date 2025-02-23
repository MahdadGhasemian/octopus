import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'mahdad.ghasemian@gmail.com',
    required: false,
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'Mahdad',
    required: false,
  })
  @IsOptional()
  full_name?: string;
}
