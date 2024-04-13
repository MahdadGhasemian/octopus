import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetOtpDto {
  @ApiProperty({
    example: 'mahdad.ghasemian@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
