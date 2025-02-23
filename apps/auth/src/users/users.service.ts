import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersRepository } from './users.repository';
import {
  AuthCommon,
  EVENT_NAME_USER_CREATED,
  EVENT_NAME_USER_UPDATED,
  STORE_SERVICE,
  UserCreatedEvent,
  UserUpdatedEvent,
} from '@app/common';
import { AccessesService } from '../accesses/accesses.service';
import { In } from 'typeorm';
import { User } from '../libs';
import { UpdateUserAccessDto } from './dto/update-user-access.dto';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from './pagination-config';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly accessesService: AccessesService,
    @Inject(STORE_SERVICE) private readonly storeClient: ClientProxy,
  ) {}

  async propareNewUser(createUserDto: CreateUserDto) {
    const hashed_password = await AuthCommon.createHash(createUserDto.password);

    const user = await this.create({
      email: createUserDto.email,
      full_name: createUserDto.full_name,
      hashed_password,
      access_ids: createUserDto.access_ids,
    });

    return this.findOne({ id: user.id });
  }

  async create(createUserDto: CreateUserDto & { hashed_password: string }) {
    const accesses = await this.accessesService.readAccesses({
      id: In(createUserDto.access_ids),
    });

    const userData = new User({
      ...createUserDto,
      accesses,
    });

    const user = await this.usersRepository.create(userData);
    delete user.hashed_password;

    const eventData = new UserCreatedEvent(user);
    this.storeClient.emit(EVENT_NAME_USER_CREATED, eventData);

    return user;
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.usersRepository.entityRepository,
      USER_PAGINATION_CONFIG,
    );
  }

  async findOne(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto, {
      accesses: true,
    });
  }

  async findOneNoCheck(settingDto: Omit<GetUserDto, 'accesses'>) {
    return this.usersRepository.findOneNoCheck(settingDto, {
      accesses: true,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneAndUpdate(
      { id },
      { ...updateUserDto },
    );
    delete user.hashed_password;

    const eventData = new UserUpdatedEvent(user);
    this.storeClient.emit(EVENT_NAME_USER_UPDATED, eventData);

    return user;
  }

  async updatePassword(id: number, password: string) {
    const hashed_password = await AuthCommon.createHash(password);

    await this.usersRepository.findOneAndUpdate(
      { id },
      {
        hashed_password,
      },
    );

    return this.findOne({ id });
  }

  async updateUserAccess(id: number, updateUserAccessDto: UpdateUserAccessDto) {
    const accesses = await this.accessesService.readAccesses({
      id: In(updateUserAccessDto.access_ids),
    });

    const user = await this.usersRepository.findOne({ id }, { accesses: true });

    user.accesses = accesses;

    await this.usersRepository.save(user);

    return user;
  }

  async remove(id: number) {
    return this.usersRepository.findOneAndDelete({ id });
  }

  async getUser(getUserDto: GetUserDto) {
    const user = await this.usersRepository.findOne(getUserDto, {
      accesses: {
        endpoints: true,
      },
    });

    delete user.hashed_password;

    return user;
  }
}
