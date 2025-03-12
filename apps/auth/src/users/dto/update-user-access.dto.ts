import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateUserAccessDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @Field(() => [Int])
  access_ids: number[];
}
