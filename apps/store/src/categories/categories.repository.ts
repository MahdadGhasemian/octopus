import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Category } from '../libs';

@Injectable()
export class CategoriesRepository extends AbstractRepository<Category> {
  protected readonly logger = new Logger(CategoriesRepository.name);

  constructor(
    @InjectRepository(Category) categoriesRepository: Repository<Category>,
    entityManager: EntityManager,
  ) {
    super(categoriesRepository, entityManager);
  }
}
