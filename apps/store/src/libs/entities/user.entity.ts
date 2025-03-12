import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class User extends AbstractEntity<User> {
  @Column()
  @Field()
  email: string;

  @Column({ nullable: true })
  @Field()
  full_name?: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
