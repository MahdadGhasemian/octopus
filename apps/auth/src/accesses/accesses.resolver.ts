import { UseGuards } from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import {
  NoCache,
  PaginateGraph,
  PaginateQueryGraph,
  Serialize,
} from '@app/common';
import { GetAccessDto } from './dto/get-access.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { ListAccessDto } from './dto/list-access.dto';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Access, Endpoint } from '../libs';

@Resolver(() => Access)
@NoCache()
export class AccessesResolver {
  constructor(private readonly accessesService: AccessesService) {}

  @Mutation(() => Access, { name: 'createAccess' })
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  @Serialize(GetAccessDto)
  async create(@Args('createAccessDto') createAccessDto: CreateAccessDto) {
    return this.accessesService.create(createAccessDto);
  }

  @Query(() => ListAccessDto, { name: 'accesses' })
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  @Serialize(ListAccessDto)
  async findAll(
    @Args() _: PaginateQueryGraph,
    @PaginateGraph() { query, config },
  ) {
    return this.accessesService.findAll(query, config);
  }

  @Query(() => Access, { name: 'access' })
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  @Serialize(GetAccessDto)
  async findOne(@Args('id') id: string) {
    return this.accessesService.findOne({ id: +id });
  }

  @Mutation(() => Access, { name: 'updateAccess' })
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  @Serialize(GetAccessDto)
  async update(
    @Args('id') id: string,
    @Args('updateAccessDto') updateAccessDto: UpdateAccessDto,
  ) {
    return this.accessesService.update({ id: +id }, updateAccessDto);
  }

  @Mutation(() => Access, { name: 'deleteAccess' })
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  @Serialize(GetAccessDto)
  async remove(@Args('id') id: string) {
    return this.accessesService.remove({ id: +id });
  }

  @ResolveField(() => [Endpoint], { name: 'endpoints', nullable: true })
  async endpoints(@Parent() access: Access) {
    return this.accessesService.getEndpointsByAccessId(access.id);
  }
}
