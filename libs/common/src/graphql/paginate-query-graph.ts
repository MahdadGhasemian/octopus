import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class PaginateQueryGraph {
  @Field(() => Int, { defaultValue: 1, nullable: true })
  @IsOptional()
  page?: number;

  @Field(() => Int, { defaultValue: 10, nullable: true })
  @IsOptional()
  limit?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  sortBy?: string | string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  searchBy?: string[];

  @Field({ nullable: true })
  @IsOptional()
  search?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  filter?: string | string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  relations?: string[];
}
