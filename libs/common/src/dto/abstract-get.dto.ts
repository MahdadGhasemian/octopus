import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsDateString, IsOptional } from 'class-validator';

@ObjectType()
export class AbstractGetDto {
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
