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
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from './dto/get-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FoceToClearCache, Serialize } from '@app/common';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { UpdateUserAccessDto } from './dto/update-user-access.dto';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from './pagination-config';
import { ListUserDto } from './dto/list-user.dto';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.propareNewUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAccessGuard)
  @Serialize(ListUserDto)
  @PaginatedSwaggerDocs(GetUserDto, USER_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard)
  @Serialize(GetUserDto)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch(':id/access')
  @UseGuards(JwtAccessGuard)
  @Serialize(GetUserDto)
  @FoceToClearCache('/users')
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async updateUserAccess(
    @Param('id') id: string,
    @Body() updateUserAccessDto: UpdateUserAccessDto,
  ) {
    return this.usersService.updateUserAccess(+id, updateUserAccessDto);
  }
}
