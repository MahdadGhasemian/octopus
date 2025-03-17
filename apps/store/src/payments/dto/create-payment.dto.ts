import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreatePaymentDto {
  @IsNumber()
  @Field(() => Int)
  order_id: number;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;
}
