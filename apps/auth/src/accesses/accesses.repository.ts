import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Access } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class AccessesRepository extends AbstractRepository<Access> {
  protected readonly logger = new Logger(AccessesRepository.name);

  constructor(
    @InjectRepository(Access) accesssRepository: Repository<Access>,
    entityManager: EntityManager,
  ) {
    super(accesssRepository, entityManager);
  }
}
