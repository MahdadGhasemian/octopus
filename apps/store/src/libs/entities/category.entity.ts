import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToMany } from 'typeorm';
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
