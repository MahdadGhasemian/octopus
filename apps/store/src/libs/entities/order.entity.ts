import { AbstractEntity, OrderStatus } from '@app/common';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { OrderItem } from './order_item.entity';
import { Payment } from './payment.entity';
import { User } from './user.entity';

@Entity()
export class Order extends AbstractEntity<Order> {
  @Column()
  order_date: Date;

  @Column()
  @Index()
  user_id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

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
