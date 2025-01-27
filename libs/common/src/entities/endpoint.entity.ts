import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../database';

@Entity()
export class Endpoint extends AbstractEntity<Endpoint> {
  @Column({ nullable: true })
  tag?: string;

  @Column()
  path: string;

  @Column()
  method: string;
}
