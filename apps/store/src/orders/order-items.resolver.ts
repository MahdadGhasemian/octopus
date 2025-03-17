import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { GetOrderItemDto } from './dto/get-order-items.dto';
import { GetProductDto } from '../products/dto/get-product.dto';
import { ProductsService } from '../products/products.service';

@Resolver(() => GetOrderItemDto)
export class OrderItemsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @ResolveField(() => GetProductDto, { name: 'product' })
  async product(@Parent() orderItem: GetOrderItemDto) {
    return this.productsService.getProduct({ id: orderItem.product_id });
  }
}
