import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ConfirmOtpDto {
  @ApiProperty({
    example: 'mahdad.ghasemian@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Mahdad Ghasemian',
    required: false,
  })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiProperty({
    example: 'YP<7(SHO@&s/Zf:;&8@Zh;!wsjNMAx6Y',
    required: false,
  })
  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: '92478',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  confirmation_code: number;

  @ApiProperty({
    example: 'a-long-token',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  hashed_code: string;
}
