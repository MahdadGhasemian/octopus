import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../database';
import { Category } from './category.entity';

@Entity()
export class Product extends AbstractEntity<Product> {
  @Column()
  name: string;

  @Column()
  description?: string;

  @Column()
  image?: string;

  @Column({ nullable: true })
  category_id?: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  price: number;

  @Column()
  sale_price: number;

  @Column()
  is_active: boolean;
}
