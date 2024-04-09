import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserDto {
  @IsNumber()
  @IsNotEmpty()
  id?: number;

  @IsEmail()
  @IsNotEmpty()
  email?: string;
}
