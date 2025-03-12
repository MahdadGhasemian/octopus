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
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Order extends AbstractEntity<Order> {
  @Column()
  @Field()
  order_date: Date;

  @Column()
  @Index()
  @Field()
  user_id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  order_items: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @Field()
  total_bill_amount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  @Field(() => OrderStatus)
  order_status: OrderStatus;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @Column({ default: false })
  @Field()
  is_paid: boolean;

  @Column()
  @Field()
  note: string;
}
