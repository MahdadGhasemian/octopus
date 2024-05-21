import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsHexColor,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EndpointAccessDto } from './endpoint-access.dto';

export class CreateAccessDto {
  @ApiProperty({
    type: String,
    example: 'Manager',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    example: 'http://www.localhost/image1000.jpg',
    required: false,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiProperty({
    type: String,
    example: '#FFFFFF',
    required: false,
  })
  @IsString()
  @IsHexColor()
  @IsOptional()
  color?: string;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: true,
  })
  @IsBoolean()
  hasFullAccess: boolean;

  @ApiProperty({
    type: EndpointAccessDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  endpoints: EndpointAccessDto[];
}
