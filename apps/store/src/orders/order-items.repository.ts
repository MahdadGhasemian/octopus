import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, OrderItem } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class OrderItemsRepository extends AbstractRepository<OrderItem> {
  protected readonly logger = new Logger(OrderItemsRepository.name);

  constructor(
    @InjectRepository(OrderItem) orderItemsRepository: Repository<OrderItem>,
    entityManager: EntityManager,
  ) {
    super(orderItemsRepository, entityManager);
  }
}
