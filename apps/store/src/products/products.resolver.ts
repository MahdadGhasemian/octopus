import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from '../libs';
import { NoCache } from '@app/common';

@Resolver(() => Product)
@NoCache()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [Product], { name: 'products' })
  async findAll() {
    const result = await this.productsService.findAllWithoutPagination();
    return result;
  }

  @Query(() => Product, { name: 'product' })
  find(@Args('id') id: string) {
    return this.productsService.findOne({ id: +id });
  }
}
