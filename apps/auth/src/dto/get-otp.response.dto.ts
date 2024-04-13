import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetOtpResponseDto {
  @ApiProperty({
    example:
      '4d9e90b73c794928032a.07fef162334a51b41478cfebf00a93d39c902cd77b0adbda299e8b8358fefba0',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  hashed_code: string;
}
