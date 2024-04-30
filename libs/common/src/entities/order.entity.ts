import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../database';
import { OrderItem } from './order_item.entity';
import { OrderStatus } from '../enum';

@Entity()
export class Order extends AbstractEntity<Order> {
  @Column()
  order_date: Date;

  @Column()
  user_id: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  order_items: OrderItem[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  order_status: OrderStatus;

  @Column()
  note: string;
}
