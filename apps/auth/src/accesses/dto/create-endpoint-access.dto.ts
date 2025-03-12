import { Field, InputType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateEndpointAccessDto {
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
