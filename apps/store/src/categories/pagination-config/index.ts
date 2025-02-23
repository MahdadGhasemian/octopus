import { PaginateConfig } from 'nestjs-paginate';
import { Category } from '../../libs';

export const CATEGORY_PAGINATION_CONFIG: PaginateConfig<Category> = {
  sortableColumns: ['id', 'name', 'description', 'image'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['name', 'description'],
  filterableColumns: {
    id: true,
    name: true,
    description: true,
  },
  maxLimit: 100,
  defaultLimit: 10,
};
