import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetAccessDto } from '../../accesses/dto/get-access.dto';
import { AbstractGetDto } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetUserDto extends AbstractGetDto {
  @IsEmail()
  @IsOptional()
  @Expose()
  @Field()
  email?: string;

  @IsString()
  @IsOptional()
  @Expose()
  @Field()
  full_name?: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @Type(() => GetAccessDto)
  @Expose()
  @Field(() => [GetAccessDto])
  accesses?: GetAccessDto[];
}
