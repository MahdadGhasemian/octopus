import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ConfirmOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  full_name: string;

  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @IsNumber()
  @IsNotEmpty()
  confirmation_code: number;

  @IsString()
  @IsNotEmpty()
  temp_token: string;
}
