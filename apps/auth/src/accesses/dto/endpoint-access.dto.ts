import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@ObjectType()
export class EndpointAccessDto {
  @IsNumber()
  @IsOptional()
  @Expose()
  @Field()
  id?: number;

  @IsString()
  @IsOptional()
  @Expose()
  @Field()
  tag?: string;

  @IsString()
  @Expose()
  @Field()
  path: string;

  @IsString()
  @Expose()
  @Field()
  method: string;
}
