import { Injectable } from '@nestjs/common';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { AccessesRepository } from './accesses.repository';
import { GetAccessDto } from './dto/get-access.dto';
import { Access, Endpoint } from '../libs';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { ACCESS_PAGINATION_CONFIG } from './pagination-config';
import { getPaginationConfig } from '@app/common';

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

  async findAll(query: PaginateQuery, config?: any) {
    return paginate(
      query,
      this.accessesRepository.entityRepository,
      getPaginationConfig(ACCESS_PAGINATION_CONFIG, { config }),
    );
  }

  async findOne(accessDto: GetAccessDto) {
    return this.accessesRepository.findOne({ ...accessDto });
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
    const access = await this.findOne({ ...accessDto });
    await this.accessesRepository.findOneAndDelete({ ...accessDto });
    return access;
  }

  async readAccesses(query: any) {
    return this.accessesRepository.findBy(query);
  }

  async getEndpointsByAccessId(access_id: number) {
    const access = await this.accessesRepository.findOneNoCheck(
      { id: access_id },
      {
        endpoints: true,
      },
    );

    return access?.endpoints || [];
  }
}
