import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
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
    type: Number,
    example: [1, 2],
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  access_ids: number[];
}
