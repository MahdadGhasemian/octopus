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
import { EndpointsService } from './endpoints.service';

@Resolver(() => Access)
@NoCache()
export class AccessesResolver {
  constructor(
    private readonly accessesService: AccessesService,
    private readonly endpointsService: EndpointsService,
  ) {}

  @Mutation(() => GetAccessDto, { name: 'createAccess' })
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

  @Query(() => GetAccessDto, { name: 'access' })
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  @Serialize(GetAccessDto)
  async findOne(@Args('id') id: string) {
    return this.accessesService.findOne({ id: +id });
  }

  @Mutation(() => GetAccessDto, { name: 'updateAccess' })
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  @Serialize(GetAccessDto)
  async update(
    @Args('id') id: string,
    @Args('updateAccessDto') updateAccessDto: UpdateAccessDto,
  ) {
    return this.accessesService.update({ id: +id }, updateAccessDto);
  }

  @Mutation(() => GetAccessDto, { name: 'deleteAccess' })
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  @Serialize(GetAccessDto)
  async remove(@Args('id') id: string) {
    return this.accessesService.remove({ id: +id });
  }

  @ResolveField(() => [Endpoint])
  async endpoints(@Parent() access: Access) {
    console.log('endpoints ---------------------------');
    return this.endpointsService.readEndpoints(access.id);
  }
}
