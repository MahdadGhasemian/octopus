import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  PAID = 'paid',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});
registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});
