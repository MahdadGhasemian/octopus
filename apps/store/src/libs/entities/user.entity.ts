import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  email: string;

  @Column({ nullable: true })
  full_name?: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
