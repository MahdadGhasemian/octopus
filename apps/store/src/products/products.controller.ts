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

@ApiTags('Products')
@Serialize(GetProductDto)
@GeneralCache()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetProductDto,
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOkResponse({
    type: [GetProductDto],
  })
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: GetProductDto,
  })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
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
  async remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
