import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../database';
import { Product } from './product.entity';

@Entity()
export class Category extends AbstractEntity<Category> {
  @Column()
  name: string;

  @Column()
  description?: string;

  @Column()
  image?: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
