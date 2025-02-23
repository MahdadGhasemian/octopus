import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetUserDto } from './get-user.dto';

export class ListUserDto extends ListDto<GetUserDto> {
  @IsArray()
  @Type(() => GetUserDto)
  @Expose()
  data: GetUserDto[];
}
