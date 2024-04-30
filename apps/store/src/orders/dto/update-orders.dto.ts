import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-orders.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
