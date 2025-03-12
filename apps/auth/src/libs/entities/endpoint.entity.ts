import { AbstractEntity } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class Endpoint extends AbstractEntity<Endpoint> {
  @Column({ nullable: true })
  @Field()
  tag?: string;

  @Column()
  @Field()
  path: string;

  @Column()
  @Field()
  method: string;
}
