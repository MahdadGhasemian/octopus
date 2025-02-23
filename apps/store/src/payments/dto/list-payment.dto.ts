import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetPaymentDto } from './get-payment.dto';

export class ListPaymentDto extends ListDto<GetPaymentDto> {
  @IsArray()
  @Type(() => GetPaymentDto)
  @Expose()
  data: GetPaymentDto[];
}
