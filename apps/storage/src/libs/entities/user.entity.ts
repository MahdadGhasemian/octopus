import { AbstractEntity } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class User extends AbstractEntity<User> {
  @Column()
  @Field()
  email: string;

  @Column({ nullable: true })
  @Field()
  full_name?: string;
}
