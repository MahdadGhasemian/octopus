import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersRepository } from './users.repository';
import { Role, User } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User({
      ...createUserDto,
      roles: createUserDto.roles?.map((roleDto) => new Role({ name: roleDto })),
    });
    return this.usersRepository.create(user);
  }

  async findAll() {
    return `This action returns all users`;
  }

  async findOne(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto, { roles: true });
  }
}
