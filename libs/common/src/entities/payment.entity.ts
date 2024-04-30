import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../database';
import { PaymentStatus } from '../enum';
import { Order } from './order.entity';

@Entity()
export class Payment extends AbstractEntity<Payment> {
  @Column()
  user_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column()
  paid_date: Date;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  payment_status: PaymentStatus;

  @Column()
  order_id: number;

  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ length: 255 })
  description: string;
}
