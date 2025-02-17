import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersRepository } from './users.repository';
import { AuthCommon } from '@app/common';
import { AccessesService } from '../accesses/accesses.service';
import { In } from 'typeorm';
import { User } from '../libs';
import { UpdateUserAccessDto } from './dto/update-user-access.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly accessesService: AccessesService,
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

    return this.usersRepository.create(userData);
  }

  async findAll() {
    return this.usersRepository.find({}, { accesses: true });
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
    return this.usersRepository.findOneAndUpdate({ id }, { ...updateUserDto });
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
