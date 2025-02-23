import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetAccessDto } from './get-access.dto';

export class LisAccessDto extends ListDto<GetAccessDto> {
  @IsArray()
  @Type(() => GetAccessDto)
  @Expose()
  data: GetAccessDto[];
}
