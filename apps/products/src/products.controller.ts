import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserCreatedEvent } from '@app/common';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getHello(): string {
    return this.productsService.getHello();
  }

  @EventPattern('user_created')
  async userCreated(@Payload() data: UserCreatedEvent) {
    console.log({ stage: 'user_created products', ...data });
  }
}
