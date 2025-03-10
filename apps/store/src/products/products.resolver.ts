import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Category, Product } from '../libs';
import { NoCache, PaginateGraph, PaginateQueryGraph } from '@app/common';
import { ListProductDto } from './dto/list-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';

@Resolver(() => Product)
@NoCache()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Query(() => ListProductDto, { name: 'products' })
  findAll(@Args() _: PaginateQueryGraph, @PaginateGraph() { query, config }) {
    return this.productsService.findAll(query, config);
  }

  @Query(() => Product, { name: 'product' })
  find(@Args('id') id: string) {
    return this.productsService.findOne({ id: +id });
  }

  @Mutation(() => Product, { name: 'updateProduct' })
  async update(
    @Args('id') id: string,
    @Args('updateProductDto') updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Mutation(() => Product, { name: 'deleteProduct' })
  async remove(@Args('id') id: string) {
    return this.productsService.remove(+id);
  }

  @ResolveField(() => Category, { nullable: true })
  async category(@Parent() product: Product) {
    return this.categoriesService.findOne({ id: product.category_id });
  }
}
