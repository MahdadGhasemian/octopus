import { AbstractEntity } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class PrivateFile extends AbstractEntity<PrivateFile> {
  @Column({ nullable: true })
  @Field()
  object_name: string;

  @Column({ nullable: true })
  @Field()
  bucket_name: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  @Field()
  description: string;

  @Column()
  @Field()
  user_id: number;
}
