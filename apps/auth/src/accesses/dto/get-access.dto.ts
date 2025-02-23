import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EndpointAccessDto } from './endpoint-access.dto';
import { Expose, Type } from 'class-transformer';
import { AbstractGetDto } from '@app/common';

export class GetAccessDto extends AbstractGetDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    type: String,
    example: 'Manager',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  title?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  @Expose()
  image?: string;

  @ApiProperty({
    type: String,
    example: '#FFFFFF',
    required: false,
  })
  @IsString()
  @IsHexColor()
  @IsOptional()
  @Expose()
  color?: string;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  @IsBoolean()
  cannot_be_deleted?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: true,
  })
  @IsBoolean()
  @Expose()
  has_full_access?: boolean;

  @ApiProperty({
    type: EndpointAccessDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @Type(() => EndpointAccessDto)
  @Expose()
  endpoints?: EndpointAccessDto[];
}
