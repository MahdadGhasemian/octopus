import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Category } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

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
