import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, PrivateFile } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

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
