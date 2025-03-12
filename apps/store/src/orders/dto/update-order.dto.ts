import { CreateOrderDto } from './create-order.dto';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateOrderDto extends CreateOrderDto {}
