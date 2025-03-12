import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetOrderDto } from './get-order.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ListOrderDto extends ListDto<GetOrderDto> {
  @IsArray()
  @Type(() => GetOrderDto)
  @Expose()
  @Field(() => [GetOrderDto])
  data: GetOrderDto[];
}
