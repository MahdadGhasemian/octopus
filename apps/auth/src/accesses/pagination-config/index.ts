import { PaginateConfig } from 'nestjs-paginate';
import { Access } from '../../libs';

export const ACCESS_PAGINATION_CONFIG: PaginateConfig<Access> = {
  sortableColumns: ['id', 'title', 'color'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title'],
  filterableColumns: {
    title: true,
  },
  maxLimit: 100,
  defaultLimit: 10,
};
