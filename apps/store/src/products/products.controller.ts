import { GeneralCache, JwtAuthAccessGuard, Serialize } from '@app/common';
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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { GetProductDto } from './dto/get-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductDto } from './dto/list-product.dto';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { PRODUCT_PAGINATION_CONFIG } from './pagination-config';

@ApiTags('Products')
@GeneralCache()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetProductDto)
  @ApiOkResponse({
    type: GetProductDto,
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Serialize(ListProductDto)
  @PaginatedSwaggerDocs(GetProductDto, PRODUCT_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @Serialize(GetProductDto)
  @ApiOkResponse({
    type: GetProductDto,
  })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetProductDto)
  @ApiOkResponse({
    type: GetProductDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetProductDto)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
