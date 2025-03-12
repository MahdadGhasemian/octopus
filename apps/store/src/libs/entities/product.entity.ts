import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { OrderItem } from './order_item.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Product extends AbstractEntity<Product> {
  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  description?: string;

  @Column()
  @Field()
  image?: string;

  @Column({ nullable: true })
  @Field()
  category_id?: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  @Field(() => Category)
  category: Category;

  @Column()
  @Field()
  price: number;

  @Column()
  @Field()
  sale_price: number;

  @Column()
  @Field()
  is_active: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  order_items: OrderItem[];
}
