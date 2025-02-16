import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem extends AbstractEntity<OrderItem> {
  @Column({ nullable: true })
  order_id?: number;

  @ManyToOne(() => Order, (order) => order.order_items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ nullable: true })
  product_id?: number;

  @ManyToOne(() => Product, (product) => product.order_items)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  quantity: number;
}
