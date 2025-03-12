import { AbstractEntity } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class Health extends AbstractEntity<Health> {
  @Column({ nullable: true })
  @Field()
  last_date_checking: Date;
}
