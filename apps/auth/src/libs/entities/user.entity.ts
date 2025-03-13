import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Access } from './access.entity';
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

  @Column()
  hashed_password: string;

  @ManyToMany(() => Access)
  @JoinTable()
  @Field(() => [Access])
  accesses: Access[];
}
