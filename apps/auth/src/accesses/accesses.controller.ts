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
import { JwtAuthAccessGuard } from '../guards/jwt-auth-access.guard';

@ApiTags('Accesses')
@Serialize(GetAccessDto)
@UseGuards(JwtAuthGuard)
@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetAccessDto,
  })
  async create(@Body() createAccessDto: CreateAccessDto) {
    return this.accessesService.create(createAccessDto);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: [GetAccessDto],
  })
  async findAll() {
    return this.accessesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetAccessDto,
  })
  async findOne(@Param('id') id: string) {
    return this.accessesService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
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
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Param('id') id: string) {
    return this.accessesService.remove({ id: +id });
  }
}
