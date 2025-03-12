import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetPaymentDto } from './get-payment.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ListPaymentDto extends ListDto<GetPaymentDto> {
  @IsArray()
  @Type(() => GetPaymentDto)
  @Expose()
  @Field(() => [GetPaymentDto])
  data: GetPaymentDto[];
}
