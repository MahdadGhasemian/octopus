import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateUserAccessDto {
  @ApiProperty({
    type: Number,
    example: [1, 2],
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  access_ids: number[];
}
