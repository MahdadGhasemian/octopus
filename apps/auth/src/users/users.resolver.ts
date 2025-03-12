import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../libs';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserDto } from './dto/list-user.dto';
import {
  FoceToClearCache,
  PaginateGraph,
  PaginateQueryGraph,
} from '@app/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserAccessDto } from './dto/update-user-access.dto';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User, { name: 'createUser' })
  @UseGuards(JwtAccessGuard)
  async create(@Args('createUserDto') createUserDto: CreateUserDto) {
    return this.usersService.propareNewUser(createUserDto);
  }

  @Query(() => ListUserDto, { name: 'users' })
  @UseGuards(JwtAccessGuard)
  async findAll(
    @Args() _: PaginateQueryGraph,
    @PaginateGraph() { query, config },
  ) {
    return this.usersService.findAll(query, config);
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAccessGuard)
  async findOne(@Args('id') id: string) {
    return this.usersService.findOne({ id: +id });
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(JwtAccessGuard)
  async update(
    @Args('id') id: string,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  @UseGuards(JwtAccessGuard)
  async remove(@Args('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Mutation(() => User, { name: 'userAccess' })
  @UseGuards(JwtAccessGuard)
  @FoceToClearCache('/users')
  async updateUserAccess(
    @Args('id') id: string,
    @Args('updateUserAccessDto') updateUserAccessDto: UpdateUserAccessDto,
  ) {
    return this.usersService.updateUserAccess(+id, updateUserAccessDto);
  }
}
