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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthAccessGuard,
  NoCache,
  Serialize,
} from '@app/common';
import { GetOrderDto } from './dto/get-order.dto';
import { User } from '../libs';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { ORDER_PAGINATION_CONFIG } from './pagination-config';
import { ListOrderDto } from './dto/list-order.dto';

@ApiTags('Orders')
@NoCache()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
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
  @Serialize(ListOrderDto)
  @PaginatedSwaggerDocs(GetOrderDto, ORDER_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery, @CurrentUser() user: User) {
    return this.ordersService.findAll(query, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.findOne({ id: +id }, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
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
  @Serialize(GetOrderDto)
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.remove({ id: +id }, user);
  }

  @Delete(':id/clear')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  async clearOrderItems(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.clearItems({ id: +id }, user);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async cancelOrder(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ordersService.cancelOrder({ id: +id }, user);
  }
}
