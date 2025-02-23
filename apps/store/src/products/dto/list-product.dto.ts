import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetProductDto } from './get-product.dto';

export class ListProductDto extends ListDto<GetProductDto> {
  @IsArray()
  @Type(() => GetProductDto)
  @Expose()
  data: GetProductDto[];
}
