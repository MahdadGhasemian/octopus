import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Endpoint } from '../libs';

@Injectable()
export class EndpointsRepository extends AbstractRepository<Endpoint> {
  protected readonly logger = new Logger(EndpointsRepository.name);

  constructor(
    @InjectRepository(Endpoint) endpointsRepository: Repository<Endpoint>,
    entityManager: EntityManager,
  ) {
    super(endpointsRepository, entityManager);
  }
}
