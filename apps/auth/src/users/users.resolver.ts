import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
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
import { GetUserDto } from './dto/get-user.dto';
import { GetAccessDto } from '../accesses/dto/get-access.dto';

@Resolver(() => GetUserDto)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => GetUserDto, { name: 'createUser' })
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

  @Query(() => GetUserDto, { name: 'user' })
  @UseGuards(JwtAccessGuard)
  async findOne(@Args('id') id: string) {
    return this.usersService.findOne({ id: +id });
  }

  @Mutation(() => GetUserDto, { name: 'updateUser' })
  @UseGuards(JwtAccessGuard)
  async update(
    @Args('id') id: string,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update({ id: +id }, updateUserDto);
  }

  @Mutation(() => GetUserDto, { name: 'deleteUser' })
  @UseGuards(JwtAccessGuard)
  async remove(@Args('id') id: string) {
    return this.usersService.remove({ id: +id });
  }

  @Mutation(() => GetUserDto, { name: 'updateUserAccess' })
  @UseGuards(JwtAccessGuard)
  @FoceToClearCache('/users')
  async updateUserAccess(
    @Args('id') id: string,
    @Args('updateUserAccessDto') updateUserAccessDto: UpdateUserAccessDto,
  ) {
    return this.usersService.updateUserAccess({ id: +id }, updateUserAccessDto);
  }

  @ResolveField(() => [GetAccessDto], { name: 'accesses', nullable: true })
  async accesses(@Parent() user: GetUserDto) {
    return this.usersService.getAccessesByAccessId(user.id);
  }
}
