import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '../database';
import { Health } from '../entities';

@Injectable()
export class HealthRepository extends AbstractRepository<Health> {
  protected readonly logger = new Logger(HealthRepository.name);

  constructor(
    @InjectRepository(Health) productsRepository: Repository<Health>,
    entityManager: EntityManager,
  ) {
    super(productsRepository, entityManager);
  }
}
