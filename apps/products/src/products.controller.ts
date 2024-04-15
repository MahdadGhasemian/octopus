import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthRoleGuard, Roles } from '@app/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(JwtAuthRoleGuard)
  @Roles('admin')
  getHello(): string {
    return this.productsService.getHello();
  }
}
