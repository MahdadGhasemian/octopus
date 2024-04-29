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
import { Roles, Serialize } from '@app/common';
import { JwtAuthRoleGuard } from '../guards/jwt-auth-role.guard';

@ApiTags('Users')
@Serialize(GetUserDto)
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthRoleGuard)
  @Roles('admin')
  @ApiOkResponse({
    type: GetUserDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.propareNewUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthRoleGuard)
  @Roles('admin')
  @ApiOkResponse({
    type: [GetUserDto],
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthRoleGuard)
  @Roles('admin')
  @ApiOkResponse({
    type: GetUserDto,
  })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthRoleGuard)
  @Roles('admin')
  @ApiOkResponse({
    type: GetUserDto,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthRoleGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
