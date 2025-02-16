import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class Health extends AbstractEntity<Health> {
  @Column({ nullable: true })
  last_date_checking: Date;
}
