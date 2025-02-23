import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Serialize } from '@app/common';
import { GetAccessDto } from './dto/get-access.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { LisAccessDto } from './dto/list-access.dto';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { ACCESS_PAGINATION_CONFIG } from './pagination-config';

@ApiTags('Accesses')
@UseGuards(JwtAuthGuard)
@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  @Serialize(GetAccessDto)
  @ApiOkResponse({
    type: GetAccessDto,
  })
  async create(@Body() createAccessDto: CreateAccessDto) {
    return this.accessesService.create(createAccessDto);
  }

  @Get()
  @UseGuards(JwtAccessGuard)
  @Serialize(LisAccessDto)
  @PaginatedSwaggerDocs(GetAccessDto, ACCESS_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.accessesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  @Serialize(GetAccessDto)
  @ApiOkResponse({
    type: GetAccessDto,
  })
  async findOne(@Param('id') id: string) {
    return this.accessesService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
  @Serialize(GetAccessDto)
  @ApiOkResponse({
    type: GetAccessDto,
  })
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
