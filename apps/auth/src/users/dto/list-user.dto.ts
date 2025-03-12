import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetUserDto } from './get-user.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ListUserDto extends ListDto<GetUserDto> {
  @IsArray()
  @Type(() => GetUserDto)
  @Expose()
  @Field(() => [GetUserDto])
  data: GetUserDto[];
}
