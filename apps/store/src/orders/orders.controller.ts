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
import { CurrentUser, JwtAuthAccessGuard, Serialize, User } from '@app/common';
import { GetOrderDto } from './dto/get-orders.dto';

@ApiTags('Orders')
@Serialize(GetOrderDto)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async create(
    @CurrentUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: [GetOrderDto],
  })
  async findAll(@CurrentUser() user: User) {
    return this.ordersService.findAll(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.findOne({ id: +id }, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update({ id: +id }, updateOrderDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.remove({ id: +id }, user);
  }

  @Delete(':id/clear')
  @UseGuards(JwtAuthAccessGuard)
  async clearOrderItems(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.clearItems({ id: +id }, user);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async cancelOrder(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.cancelOrder({ id: +id }, user);
  }
}
