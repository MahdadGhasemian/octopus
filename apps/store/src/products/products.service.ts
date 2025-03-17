import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category, Product } from '../libs';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { PRODUCT_PAGINATION_CONFIG } from './pagination-config';
import { getPaginationConfig } from '@app/common';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto) {
    const product = new Product({
      ...createProductDto,
      category: new Category({ id: createProductDto.category_id }),
    });

    const result = await this.productsRepository.create(product);

    return this.findOne({ id: result.id });
  }

  async findAll(query: PaginateQuery, config?: any) {
    return paginate(
      query,
      this.productsRepository.entityRepository,
      getPaginationConfig(PRODUCT_PAGINATION_CONFIG, { config }),
    );
  }

  async findOne(productDto: GetProductDto) {
    return this.productsRepository.findOne(productDto);
  }

  async update(productDto: GetProductDto, updateProductDto: UpdateProductDto) {
    const updateData: Partial<Product> = {
      ...updateProductDto,
    };
    if (updateProductDto?.category_id) {
      updateData.category = new Category({ id: updateProductDto.category_id });
    }

    const result = await this.productsRepository.findOneAndUpdate(
      { ...productDto },
      { ...updateData },
    );

    return this.findOne({ id: result.id });
  }

  async remove(productDto: GetProductDto) {
    const product = await this.findOne({ ...productDto });
    await this.productsRepository.findOneAndDelete({ ...productDto });
    return product;
  }

  async getProduct(productDto: GetProductDto) {
    return this.productsRepository.findOneNoCheck(productDto);
  }
}
