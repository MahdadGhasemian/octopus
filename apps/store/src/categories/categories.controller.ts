import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GeneralCache, JwtAuthAccessGuard, Serialize } from '@app/common';
import { GetCategoryDto } from './dto/get-category.dto';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { CATEGORY_PAGINATION_CONFIG } from './pagination-config';
import { ListCategoryDto } from './dto/list-category.dto';

@ApiTags('Categories')
@GeneralCache()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetCategoryDto)
  @ApiOkResponse({
    type: GetCategoryDto,
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Serialize(ListCategoryDto)
  @PaginatedSwaggerDocs(GetCategoryDto, CATEGORY_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  @Serialize(GetCategoryDto)
  @ApiOkResponse({
    type: GetCategoryDto,
  })
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetCategoryDto)
  @ApiOkResponse({
    type: GetCategoryDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetCategoryDto)
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
