import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'mahdad.ghasemian@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'YP<7(SHO@&s/Zf:;&8@Zh;!wsjNMAx6Y',
    required: false,
  })
  @IsStrongPassword()
  @IsOptional()
  password?: string;
}
