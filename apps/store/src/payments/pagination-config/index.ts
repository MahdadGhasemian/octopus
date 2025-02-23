import { PaginateConfig } from 'nestjs-paginate';
import { Payment } from '../../libs';

export const PAYMENT_PAGINATION_CONFIG: PaginateConfig<Payment> = {
  sortableColumns: ['id', 'payment_status', 'amount', 'description'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['payment_status', 'amount', 'description'],
  relations: ['user', 'order'],
  filterableColumns: {
    amount: true,
  },
  maxLimit: 100,
  defaultLimit: 10,
};
