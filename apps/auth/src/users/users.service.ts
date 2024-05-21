import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersRepository } from './users.repository';
import { AuthCommon, User } from '@app/common';
import { AccessesService } from '../accesses/accesses.service';
import { In } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly accessesService: AccessesService,
  ) {}

  async propareNewUser(createUserDto: CreateUserDto) {
    const hashed_password = await AuthCommon.createHash(createUserDto.password);

    return this.create({
      email: createUserDto.email,
      full_name: createUserDto.full_name,
      hashed_password,
      access_ids: createUserDto.access_ids,
    });
  }

  async create(createUserDto: CreateUserDto & { hashed_password: string }) {
    const accesses = await this.accessesService.readAccesses({
      id: In(createUserDto.access_ids),
    });

    const user = new User({
      ...createUserDto,
      accesses,
    });

    return this.usersRepository.create(user);
  }

  async findAll() {
    return this.usersRepository.find({}, { accesses: true });
  }

  async findOne(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto, {
      accesses: true,
    });
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
    return this.usersRepository.findOne(getUserDto, {
      accesses: {
        endpoints: true,
      },
    });
  }
}
