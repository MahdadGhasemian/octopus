import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersRepository } from './users.repository';
import { AuthCommon, Role, User } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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

  async updateRole(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ id }, { roles: true });

    user.roles = updateUserDto.roles?.map(
      (roleDto) => new Role({ name: roleDto }),
    );

    return this.usersRepository.create(user);
  }

  async remove(id: number) {
    return this.usersRepository.findOneAndDelete({ id });
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto, { roles: true });
  }
}
