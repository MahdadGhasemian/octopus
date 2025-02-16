import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class PrivateFile extends AbstractEntity<PrivateFile> {
  @Column({ nullable: true })
  object_name: string;

  @Column({ nullable: true })
  bucket_name: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  user_id: number;
}
