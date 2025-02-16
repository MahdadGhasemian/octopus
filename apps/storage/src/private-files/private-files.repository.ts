import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PrivateFile } from '../libs';

@Injectable()
export class PrivateFilesRepository extends AbstractRepository<PrivateFile> {
  protected readonly logger = new Logger(PrivateFilesRepository.name);

  constructor(
    @InjectRepository(PrivateFile)
    privateFilesRepository: Repository<PrivateFile>,
    entityManager: EntityManager,
  ) {
    super(privateFilesRepository, entityManager);
  }
}
