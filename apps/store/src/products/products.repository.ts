import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Product } from '../libs';

@Injectable()
export class ProductsRepository extends AbstractRepository<Product> {
  protected readonly logger = new Logger(ProductsRepository.name);

  constructor(
    @InjectRepository(Product) productsRepository: Repository<Product>,
    entityManager: EntityManager,
  ) {
    super(productsRepository, entityManager);
  }
}
