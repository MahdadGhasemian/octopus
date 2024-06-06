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

@ApiTags('Categories')
@Serialize(GetCategoryDto)
@GeneralCache()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetCategoryDto,
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOkResponse({
    type: [GetCategoryDto],
  })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: GetCategoryDto,
  })
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
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
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
