import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Category } from '../libs';
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

@Resolver(() => Category)
@NoCache()
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category, { name: 'createCategory' })
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

  @Query(() => Category, { name: 'category' })
  async findOne(@Args('id') id: string) {
    return this.categoriesService.findOne({ id: +id });
  }

  @Mutation(() => Category, { name: 'updateCategory' })
  @UseGuards(JwtAuthAccessGuard)
  async update(
    @Args('id') id: string,
    @Args('updateCategoryDto') updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Mutation(() => Category, { name: 'deleteCategory' })
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Args('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
