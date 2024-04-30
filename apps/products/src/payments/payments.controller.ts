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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payments.dto';
import { UpdatePaymentDto } from './dto/update-payments.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthRoleGuard,
  Roles,
  Serialize,
  User,
} from '@app/common';
import { GetPaymentDto } from './dto/get-payments.dto';

@ApiTags('Payments')
@Serialize(GetPaymentDto)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthRoleGuard)
  @Roles('user')
  @ApiOkResponse({
    type: GetPaymentDto,
  })
  async create(
    @CurrentUser() user: User,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(createPaymentDto, user);
  }

  @Get()
  @UseGuards(JwtAuthRoleGuard)
  @Roles('user')
  @ApiOkResponse({
    type: [GetPaymentDto],
  })
  async findAll(@CurrentUser() user: User) {
    return this.paymentsService.findAll(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthRoleGuard)
  @Roles('user')
  @ApiOkResponse({
    type: GetPaymentDto,
  })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.paymentsService.findOne({ id: +id }, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthRoleGuard)
  @Roles('user')
  @ApiOkResponse({
    type: GetPaymentDto,
  })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update({ id: +id }, updatePaymentDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthRoleGuard)
  @Roles('user')
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.paymentsService.remove({ id: +id }, user);
  }
}
