import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

@ObjectType()
export class AbstractGetDto {
  @IsNumber()
  @IsOptional()
  @Expose()
  @Field(() => Int)
  id?: number;

  @IsDateString()
  @IsOptional()
  @Expose()
  @Field()
  created_at?: Date;

  @IsDateString()
  @IsOptional()
  @Expose()
  @Field()
  updated_at?: Date;
}
