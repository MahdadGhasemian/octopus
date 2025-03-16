import { Field, InputType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class GetEndpointAccessDto {
  @IsString()
  @IsOptional()
  @Expose()
  @Field(() => String, { nullable: true })
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
