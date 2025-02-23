import { Expose } from 'class-transformer';
import { Column, SortBy } from 'nestjs-paginate/lib/helper';

export class ListDto<T> {
  @Expose()
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: SortBy<T>;
    searchBy: Column<T>[];
    search: string;
    select: string[];
    filter?: {
      [column: string]: string | string[];
    };
  };

  @Expose()
  links: {
    first?: string;
    previous?: string;
    current: string;
    next?: string;
    last?: string;
  };
}
