import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from '../libs';
import { NoCache, PaginateGraph, PaginateQueryGraph } from '@app/common';
import { ListProductDto } from './dto/list-product.dto';
import { PaginateQuery } from 'nestjs-paginate';

@Resolver(() => Product)
@NoCache()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => ListProductDto, { name: 'products' })
  findAll(
    @Args() _: PaginateQueryGraph,
    @PaginateGraph() query: PaginateQuery,
  ) {
    return this.productsService.findAll(query);
  }

  @Query(() => Product, { name: 'product' })
  find(@Args('id') id: string) {
    return this.productsService.findOne({ id: +id });
  }
}
