import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { GetCategoryDto } from './dto/get-category.dto';
import { Category } from '../libs';
import { CATEGORY_PAGINATION_CONFIG } from './pagination-config';
import { paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category({
      ...createCategoryDto,
    });

    return this.categoriesRepository.create(category);
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.categoriesRepository.entityRepository,
      CATEGORY_PAGINATION_CONFIG,
    );
  }

  async findOne(categoryDto: GetCategoryDto) {
    return this.categoriesRepository.findOne(categoryDto);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesRepository.findOneAndUpdate(
      { id },
      { ...updateCategoryDto },
    );
  }

  async remove(id: number) {
    return this.categoriesRepository.findOneAndDelete({ id });
  }
}
