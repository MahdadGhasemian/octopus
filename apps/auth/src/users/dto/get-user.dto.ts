import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetAccessDto } from '../../accesses/dto/get-access.dto';

export class GetUserDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    example: 'mahdad.ghasemian@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsOptional()
  @Expose()
  email?: string;

  @ApiProperty({
    example: 'Mahdad Ghasemian',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  full_name?: string;

  @ApiProperty({
    type: GetAccessDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @Type(() => GetAccessDto)
  @Expose()
  accesses?: GetAccessDto[];
}
