import { CreateOrderDto } from './create-order.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
