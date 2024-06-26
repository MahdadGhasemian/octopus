import { AbstractEntity } from '../database';
import { Column, Entity } from 'typeorm';

@Entity()
export class PrivateFile extends AbstractEntity<PrivateFile> {
  @Column()
  file_name: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  user_id: number;
}
