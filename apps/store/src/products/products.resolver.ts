import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from '../libs';
import { NoCache, PaginateGraph, PaginateQueryGraph } from '@app/common';
import { ListProductDto } from './dto/list-product.dto';

@Resolver(() => Product)
@NoCache()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly paginateGraph: PaginateGraph,
  ) {}

  @Query(() => ListProductDto, { name: 'products' })
  findAll(@Args() paginateQueryGraph: PaginateQueryGraph) {
    const paginateQuery = this.paginateGraph.getPaginateQuery(
      paginateQueryGraph,
      'products',
    );

    return this.productsService.findAll(paginateQuery);
  }

  @Query(() => Product, { name: 'product' })
  find(@Args('id') id: string) {
    return this.productsService.findOne({ id: +id });
  }
}
