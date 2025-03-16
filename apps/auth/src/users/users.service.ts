import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersRepository } from './users.repository';
import {
  AuthCommon,
  EVENT_NAME_USER_CREATED,
  EVENT_NAME_USER_UPDATED,
  getPaginationConfig,
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

  async findAll(query?: PaginateQuery, config?: any) {
    return paginate(
      query,
      this.usersRepository.entityRepository,
      getPaginationConfig(USER_PAGINATION_CONFIG, { config }),
    );
  }

  async findOne(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  async findOneNoCheck(settingDto: Omit<GetUserDto, 'accesses'>) {
    return this.usersRepository.findOneNoCheck(settingDto, {
      accesses: true,
    });
  }

  async update(userDto: GetUserDto, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneAndUpdate(
      { ...userDto },
      { ...updateUserDto },
    );
    delete user.hashed_password;

    const eventData = new UserUpdatedEvent(user);
    this.storeClient.emit(EVENT_NAME_USER_UPDATED, eventData);

    return user;
  }

  async updatePassword(userDto: GetUserDto, password: string) {
    const hashed_password = await AuthCommon.createHash(password);

    await this.usersRepository.findOneAndUpdate(
      { ...userDto },
      {
        hashed_password,
      },
    );

    return this.findOne({ ...userDto });
  }

  async updateUserAccess(
    userDto: GetUserDto,
    updateUserAccessDto: UpdateUserAccessDto,
  ) {
    const accesses = await this.accessesService.readAccesses({
      id: In(updateUserAccessDto.access_ids),
    });

    const user = await this.usersRepository.findOne(
      { ...userDto },
      { accesses: true },
    );

    user.accesses = accesses;

    await this.usersRepository.save(user);

    return user;
  }

  async remove(userDto: GetUserDto) {
    const user = await this.findOne({ ...userDto });
    await this.usersRepository.findOneAndDelete({ ...userDto });
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    const user = await this.usersRepository.findOne(getUserDto, {
      accesses: {
        //     endpoints: true,
      },
    });

    delete user.hashed_password;

    return user;
  }

  async getAccessesByAccessId(user_id: number) {
    const access = await this.usersRepository.findOneNoCheck(
      { id: user_id },
      {
        accesses: true,
      },
    );

    return access?.accesses || [];
  }
}
