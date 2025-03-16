import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Endpoint } from './endpoint.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Access extends AbstractEntity<Access> {
  @Column()
  @Field()
  title: string;

  @Column({ nullable: true })
  @Field()
  image?: string;

  @Column({ nullable: true })
  @Field()
  color?: string;

  @Column({ default: false })
  @Field()
  cannot_be_deleted: boolean;

  @Column({ default: false })
  @Field()
  has_full_access: boolean;

  @ManyToMany(() => Endpoint, { cascade: true })
  @JoinTable()
  @Field(() => [Endpoint])
  endpoints: Endpoint[];
}
