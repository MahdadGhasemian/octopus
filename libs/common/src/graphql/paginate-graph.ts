import { Injectable } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { PaginateQueryGraph } from './paginate-query-graph';

@Injectable()
export class PaginateGraph {
  parseSortByString(sortBy: string): [string, string][] {
    // sortBy: [ [ 'name', 'DESC' ], [ 'id', 'ASC' ] ]
    return sortBy.split(',').map((entry) => {
      const [column, order] = entry.split(':');
      return [column, order.toUpperCase()] as [string, string];
    });
  }

  getPaginateQuery(
    paginateQueryGraph: PaginateQueryGraph,
    path: string,
  ): PaginateQuery {
    const sortBy = this.parseSortByString(String(paginateQueryGraph.sortBy));

    return {
      ...paginateQueryGraph,
      sortBy,
      filter: undefined,
      path,
    };
  }
}
