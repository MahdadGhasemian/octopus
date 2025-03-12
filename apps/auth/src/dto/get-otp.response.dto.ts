import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class GetOtpResponseDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  hashed_code: string;
}
