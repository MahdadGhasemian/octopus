import { AbstractEntity, OrderStatus } from '@app/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { OrderItem } from './order_item.entity';
import { Payment } from './payment.entity';

@Entity()
export class Order extends AbstractEntity<Order> {
  @Column()
  order_date: Date;

  @Column()
  user_id: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  order_items: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_bill_amount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  order_status: OrderStatus;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @Column({ default: false })
  is_paid: boolean;

  @Column()
  note: string;
}
