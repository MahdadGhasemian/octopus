import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../database';

@Entity()
export class Category extends AbstractEntity<Category> {
  @Column()
  name: string;

  @Column()
  description?: string;

  @Column()
  image?: string;
}
