import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetAccessDto } from './get-access.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ListAccessDto extends ListDto<GetAccessDto> {
  @IsArray()
  @Type(() => GetAccessDto)
  @Expose()
  @Field(() => [GetAccessDto])
  data: GetAccessDto[];
}
