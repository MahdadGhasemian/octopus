import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetCategoryDto } from './get-category.dto';

export class ListCategoryDto extends ListDto<GetCategoryDto> {
  @IsArray()
  @Type(() => GetCategoryDto)
  @Expose()
  data: GetCategoryDto[];
}
