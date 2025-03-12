import { CreatePaymentDto } from './create-payment.dto';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePaymentDto extends CreatePaymentDto {}
