import { PaginateConfig } from 'nestjs-paginate';
import { Product } from '../../libs';

export const PRODUCT_PAGINATION_CONFIG: PaginateConfig<Product> = {
  sortableColumns: [
    'id',
    'name',
    'description',
    'price',
    'sale_price',
    'is_active',
    'category_id',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['name', 'description'],
  filterableColumns: {
    id: true,
    name: true,
    description: true,
    price: true,
    sale_price: true,
    is_active: true,
    'category.id': true,
    'category.name': true,
  },
  maxLimit: 100,
};
