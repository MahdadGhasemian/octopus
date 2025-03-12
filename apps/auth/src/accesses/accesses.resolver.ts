import { Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { Serialize } from '@app/common';
import { GetAccessDto } from './dto/get-access.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { LisAccessDto } from './dto/list-access.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@UseGuards(JwtAuthGuard)
@Resolver()
export class AccessesResolver {
  constructor(private readonly accessesService: AccessesService) {}

  @Mutation(() => GetAccessDto, { name: 'createAccess' })
  @UseGuards(JwtAccessGuard)
  @Serialize(GetAccessDto)
  async create(@Args('createAccessDto') createAccessDto: CreateAccessDto) {
    return this.accessesService.create(createAccessDto);
  }

  @Get()
  @UseGuards(JwtAccessGuard)
  @Serialize(LisAccessDto)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.accessesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  @Serialize(GetAccessDto)
  async findOne(@Param('id') id: string) {
    return this.accessesService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
  @Serialize(GetAccessDto)
  async update(
    @Param('id') id: string,
    @Body() updateAccessDto: UpdateAccessDto,
  ) {
    return this.accessesService.update({ id: +id }, updateAccessDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard)
  @Serialize(GetAccessDto)
  async remove(@Param('id') id: string) {
    return this.accessesService.remove({ id: +id });
  }
}
