import { PaginateConfig } from 'nestjs-paginate';
import { User } from '../../libs';

export const USER_PAGINATION_CONFIG: PaginateConfig<User> = {
  sortableColumns: ['id', 'email', 'full_name'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['email', 'full_name'],
  filterableColumns: {
    email: true,
    'accesses.title': true,
  },
  maxLimit: 100,
  defaultLimit: 10,
};
