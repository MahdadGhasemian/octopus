import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProductsService } from './products.service';
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
import { GetProductDto } from './dto/get-product.dto';
import { GetCategoryDto } from '../categories/dto/get-category.dto';

@Resolver(() => GetProductDto)
@NoCache()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Mutation(() => GetProductDto, { name: 'createProduct' })
  @UseGuards(JwtAuthAccessGuard)
  async create(@Args('createProductDto') createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Query(() => ListProductDto, { name: 'products' })
  findAll(@Args() _: PaginateQueryGraph, @PaginateGraph() { query, config }) {
    return this.productsService.findAll(query, config);
  }

  @Query(() => GetProductDto, { name: 'product' })
  async find(@Args('id') id: string) {
    return this.productsService.findOne({ id: +id });
  }

  @Mutation(() => GetProductDto, { name: 'updateProduct' })
  @UseGuards(JwtAuthAccessGuard)
  async update(
    @Args('id') id: string,
    @Args('updateProductDto') updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update({ id: +id }, updateProductDto);
  }

  @Mutation(() => GetProductDto, { name: 'deleteProduct' })
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Args('id') id: string) {
    return this.productsService.remove({ id: +id });
  }

  @ResolveField(() => GetCategoryDto, { name: 'category', nullable: true })
  async category(@Parent() product: GetProductDto) {
    return this.categoriesService.findOne({ id: product.category_id });
  }
}
