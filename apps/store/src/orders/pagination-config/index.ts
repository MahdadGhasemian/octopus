import { PaginateConfig } from 'nestjs-paginate';
import { Order } from '../../libs';

export const ORDER_PAGINATION_CONFIG: PaginateConfig<Order> = {
  sortableColumns: [
    'id',
    'order_date',
    'total_bill_amount',
    'order_status',
    'is_paid',
    'note',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['total_bill_amount', 'user.full_name'],
  relations: ['user', 'payments', 'order_items', 'order_items.product'],
  filterableColumns: {
    total_bill_amount: true,
    order_status: true,
    note: true,
  },
  maxLimit: 100,
  defaultLimit: 10,
};
