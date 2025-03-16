import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  JwtAuthAccessGuard,
  NoCache,
  PaginateGraph,
  PaginateQueryGraph,
} from '@app/common';
import { CategoriesService } from './categories.service';
import { UseGuards } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ListCategoryDto } from './dto/list-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { GetProductDto } from '../products/dto/get-product.dto';

@Resolver(() => GetCategoryDto)
@NoCache()
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => GetCategoryDto, { name: 'createCategory' })
  @UseGuards(JwtAuthAccessGuard)
  async create(
    @Args('createCategoryDto') createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Query(() => ListCategoryDto, { name: 'categories' })
  async findAll(
    @Args() _: PaginateQueryGraph,
    @PaginateGraph() { query, config },
  ) {
    return this.categoriesService.findAll(query, config);
  }

  @Query(() => GetCategoryDto, { name: 'category' })
  async findOne(@Args('id') id: string) {
    return this.categoriesService.findOne({ id: +id });
  }

  @Mutation(() => GetCategoryDto, { name: 'updateCategory' })
  @UseGuards(JwtAuthAccessGuard)
  async update(
    @Args('id') id: string,
    @Args('updateCategoryDto') updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update({ id: +id }, updateCategoryDto);
  }

  @Mutation(() => GetCategoryDto, { name: 'deleteCategory' })
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Args('id') id: string) {
    return this.categoriesService.remove({ id: +id });
  }

  @ResolveField(() => [GetProductDto], { name: 'products', nullable: true })
  async products(@Parent() category: GetCategoryDto) {
    return this.categoriesService.getProductsByCatgegoryId(category.id);
  }
}
