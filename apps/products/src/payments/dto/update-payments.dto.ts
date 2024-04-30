import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payments.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
