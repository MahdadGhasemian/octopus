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
import {
  JwtAuthAccessGuard,
  NoCache,
  PaginateGraph,
  PaginateQueryGraph,
} from '@app/common';
import { ListProductDto } from './dto/list-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { UseGuards } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';

@Resolver(() => Product)
@NoCache()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Mutation(() => Product, { name: 'createProduct' })
  @UseGuards(JwtAuthAccessGuard)
  async create(@Args('createProductDto') createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Query(() => ListProductDto, { name: 'products' })
  findAll(@Args() _: PaginateQueryGraph, @PaginateGraph() { query, config }) {
    return this.productsService.findAll(query, config);
  }

  @Query(() => Product, { name: 'product' })
  async find(@Args('id') id: string) {
    return this.productsService.findOne({ id: +id });
  }

  @Mutation(() => Product, { name: 'updateProduct' })
  @UseGuards(JwtAuthAccessGuard)
  async update(
    @Args('id') id: string,
    @Args('updateProductDto') updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Mutation(() => Product, { name: 'deleteProduct' })
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Args('id') id: string) {
    return this.productsService.remove(+id);
  }

  @ResolveField(() => Category, { nullable: true })
  async category(@Parent() product: Product) {
    return this.categoriesService.findOne({ id: product.category_id });
  }
}
