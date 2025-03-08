import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;

  @Field({ nullable: true })
  startCursor?: string;

  @Field({ nullable: true })
  endCursor?: string;
}

@ObjectType()
export class PaginatedResult<T> {
  @Field(() => PageInfo)
  pageInfo: PageInfo;

  edges: { node: T; cursor: string }[];
}
