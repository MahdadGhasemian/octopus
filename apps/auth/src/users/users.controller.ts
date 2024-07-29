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
import { Serialize } from '@app/common';
import { JwtAuthAccessGuard } from '../guards/jwt-auth-access.guard';

@ApiTags('Users')
@Serialize(GetUserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.propareNewUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: [GetUserDto],
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
