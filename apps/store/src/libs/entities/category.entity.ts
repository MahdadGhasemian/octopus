import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Category extends AbstractEntity<Category> {
  @Column()
  @Field()
  name: string;

  @Column()
  @Field(() => String, { nullable: true })
  description?: string;

  @Column()
  @Field(() => String, { nullable: true })
  image?: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
