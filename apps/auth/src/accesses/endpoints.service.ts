import { Injectable } from '@nestjs/common';
import { EndpointsRepository } from './endpoints.repository';

@Injectable()
export class EndpointsService {
  constructor(private readonly endpointsRepository: EndpointsRepository) {}

  async readEndpoints(access_id: number) {
    return this.endpointsRepository.entityRepository
      .createQueryBuilder('endpoint')
      .innerJoin('endpoint.accesses', 'access')
      .where('access.id = :id', { id: access_id })
      .getMany();
  }
}
