import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Payment } from '../libs';

@Injectable()
export class PaymentsRepository extends AbstractRepository<Payment> {
  protected readonly logger = new Logger(PaymentsRepository.name);

  constructor(
    @InjectRepository(Payment) paymentsRepository: Repository<Payment>,
    entityManager: EntityManager,
  ) {
    super(paymentsRepository, entityManager);
  }
}
