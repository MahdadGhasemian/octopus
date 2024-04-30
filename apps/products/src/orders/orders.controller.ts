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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-orders.dto';
import { UpdateOrderDto } from './dto/update-orders.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthRoleGuard,
  Roles,
  Serialize,
  User,
} from '@app/common';
import { GetOrderDto } from './dto/get-orders.dto';

@ApiTags('Orders')
@Serialize(GetOrderDto)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthRoleGuard)
  @Roles('user')
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async create(
    @CurrentUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create({ ...createOrderDto, user_id: user.id });
  }

  @Get()
  @UseGuards(JwtAuthRoleGuard)
  @Roles('user')
  @ApiOkResponse({
    type: [GetOrderDto],
  })
  async findAll(@CurrentUser() user: User) {
    return this.ordersService.findAll({ user_id: user.id });
  }

  @Get(':id')
  @UseGuards(JwtAuthRoleGuard)
  @Roles('user')
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.findOne({ id: +id, user_id: user.id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthRoleGuard)
  @Roles('user')
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(
      { id: +id, user_id: user.id },
      updateOrderDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthRoleGuard)
  @Roles('user')
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.remove({ id: +id, user_id: user.id });
  }

  @Delete(':id/clear')
  @UseGuards(JwtAuthRoleGuard)
  @Roles('user')
  async clearOrderItems(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.clearItems({ id: +id, user_id: user.id });
  }
}
