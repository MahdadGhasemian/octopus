import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class Endpoint extends AbstractEntity<Endpoint> {
  @Column({ nullable: true })
  tag?: string;

  @Column()
  path: string;

  @Column()
  method: string;
}
