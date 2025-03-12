import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Column, SortBy } from 'nestjs-paginate/lib/helper';

@ObjectType()
@Directive('@shareable')
export class MetaType<T> {
  @IsNumber()
  @IsOptional()
  @Field(() => Int)
  itemsPerPage: number;

  @IsNumber()
  @IsOptional()
  @Field(() => Int)
  totalItems: number;

  @IsNumber()
  @IsOptional()
  @Field(() => Int)
  currentPage: number;

  @IsNumber()
  @IsOptional()
  @Field(() => Int)
  totalPages: number;

  @IsOptional()
  @Field(() => GraphQLJSONObject, { nullable: true })
  sortBy?: SortBy<T>;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  searchBy?: Column<T>[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  search?: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  select?: string[];

  @IsOptional()
  @Field(() => GraphQLJSONObject, { nullable: true })
  filter?: string;
}

@ObjectType()
@Directive('@shareable')
export class LinksType {
  @IsOptional()
  @Field(() => String, { nullable: true })
  first?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  previous?: string;

  @IsOptional()
  @Field(() => String)
  current: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  next?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  last?: string;
}

@ObjectType()
export class ListDto<T> {
  @Expose()
  @Field(() => MetaType<T>)
  meta: MetaType<T>;

  @Expose()
  @Field(() => LinksType)
  links: LinksType;
}
