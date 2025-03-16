import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Endpoint } from './endpoint.entity';

@Entity()
export class Access extends AbstractEntity<Access> {
  @Column()
  title: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ default: false })
  cannot_be_deleted: boolean;

  @Column({ default: false })
  has_full_access: boolean;

  @ManyToMany(() => Endpoint, { cascade: true })
  @JoinTable()
  endpoints: Endpoint[];
}
