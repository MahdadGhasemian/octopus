import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PaginateQueryGraph } from './paginate-query-graph';

const parseSortByString = (sortBy: string): [string, string][] => {
  // sortBy: [ [ 'name', 'DESC' ], [ 'id', 'ASC' ] ]
  return sortBy.split(',').map((entry) => {
    const [column, order] = entry.split(':');
    return [column, order.toUpperCase()] as [string, string];
  });
};

export const PaginateGraph = createParamDecorator(
  (data: { path: string }, ctx: ExecutionContext) => {
    // Access the GraphQL context
    const gqlContext = GqlExecutionContext.create(ctx);
    const paginateQueryGraph: PaginateQueryGraph = gqlContext.getArgs();

    const sortBy = paginateQueryGraph.sortBy
      ? parseSortByString(String(paginateQueryGraph.sortBy))
      : [];

    return {
      ...paginateQueryGraph,
      sortBy,
      filter: undefined,
      path: data.path,
    };
  },
);
