import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id?: number;

  @CreateDateColumn({ type: 'timestamptz' })
  @Field()
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field()
  updated_at?: Date;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
