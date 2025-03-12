import { AbstractEntity, PaymentStatus } from '@app/common';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Payment extends AbstractEntity<Payment> {
  @Column()
  @Index()
  @Field()
  user_id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @Field()
  amount: number;

  @Column({ nullable: true })
  @Field()
  paid_date?: Date;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  @Field(() => PaymentStatus)
  payment_status: PaymentStatus;

  @Column()
  @Field()
  order_id: number;

  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ length: 255 })
  @Field()
  description?: string;
}
