import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersRepository } from './users.repository';
import {
  AuthCommon,
  GENERAL_SERVICE,
  Role,
  User,
  UserCreatedEvent,
} from '@app/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(GENERAL_SERVICE) private readonly client: ClientKafka,
  ) {}

  async propareNewUser(createUserDto: CreateUserDto) {
    const hashed_password = await AuthCommon.createHash(createUserDto.password);

    return this.create({
      email: createUserDto.email,
      full_name: createUserDto.full_name,
      // @ts-expect-error
      hashed_password,
      roles: createUserDto.roles,
    });
  }

  async create(createUserDto: CreateUserDto) {
    const user = new User({
      ...createUserDto,
      roles: createUserDto.roles?.map((roleDto) => new Role({ name: roleDto })),
    });

    this.client.emit(
      'user_created',
      new UserCreatedEvent(user.id, user.email, user.full_name),
    );

    return this.usersRepository.create(user);
  }

  async findAll() {
    return this.usersRepository.find({}, { roles: true });
  }

  async findOne(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto, { roles: true });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.findOneAndUpdate(
      { id },
      {
        full_name: updateUserDto.full_name,
      },
    );
  }

  async remove(id: number) {
    return this.usersRepository.findOneAndDelete({ id });
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto, { roles: true });
  }
}
