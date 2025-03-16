import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;

  constructor(
    readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async save(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  async findOneNoCheck(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> {
    return this.entityRepository.findOne({ where, relations });
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> {
    const entity = await this.entityRepository.findOne({ where, relations });

    if (!entity) {
      this.logger.warn('Entity not found with filterQuery', where);
      throw new NotFoundException('Entity not found.');
    }

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const updateResult = await this.entityRepository.update(
      where,
      partialEntity,
    );

    if (!updateResult.affected) {
      this.logger.warn('Entity not found with filterQuery', where);
      throw new NotFoundException('Entity not found.');
    }

    return this.findOne(where);
  }

  async find(where: FindOptionsWhere<T>, relations?: FindOptionsRelations<T>) {
    return this.entityRepository.find({ where, relations });
  }

  async findBy(where: FindOptionsWhere<T>) {
    return this.entityRepository.findBy(where);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    await this.entityRepository.delete(where);
  }

  async runInTransaction<R>(run: () => Promise<R>): Promise<R> {
    return this.entityManager.transaction(run);
  }
}
