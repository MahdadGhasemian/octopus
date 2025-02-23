import { Injectable } from '@nestjs/common';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { AccessesRepository } from './accesses.repository';
import { GetAccessDto } from './dto/get-access.dto';
import { Access, Endpoint } from '../libs';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { ACCESS_PAGINATION_CONFIG } from './pagination-config';

@Injectable()
export class AccessesService {
  constructor(private readonly accessesRepository: AccessesRepository) {}

  async create(createAccessDto: CreateAccessDto) {
    const access = new Access({
      ...createAccessDto,
      endpoints: createAccessDto.endpoints?.map(
        (endpointDto) => new Endpoint({ ...endpointDto }),
      ),
    });

    return this.accessesRepository.create(access);
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.accessesRepository.entityRepository,
      ACCESS_PAGINATION_CONFIG,
    );
  }

  async findOne(accessDto: GetAccessDto) {
    return this.accessesRepository.findOne(
      { ...accessDto },
      {
        endpoints: true,
      },
    );
  }

  async update(accessDto: GetAccessDto, updateAccessDto: UpdateAccessDto) {
    const access = await this.accessesRepository.findOne(accessDto, {
      endpoints: true,
    });

    access.endpoints = updateAccessDto.endpoints?.map(
      (endpointDto) => new Endpoint({ ...endpointDto }),
    );

    return this.accessesRepository.create(access);
  }

  async remove(accessDto: GetAccessDto) {
    return this.accessesRepository.findOneAndDelete({ ...accessDto });
  }

  async readAccesses(query: any) {
    return this.accessesRepository.findBy(query);
  }
}
