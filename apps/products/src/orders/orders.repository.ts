import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Order } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class OrdersRepository extends AbstractRepository<Order> {
  protected readonly logger = new Logger(OrdersRepository.name);

  constructor(
    @InjectRepository(Order) ordersRepository: Repository<Order>,
    entityManager: EntityManager,
  ) {
    super(ordersRepository, entityManager);
  }
}
