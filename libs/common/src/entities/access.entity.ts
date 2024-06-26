import { AbstractEntity } from '../database';
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
  cannotBeDeleted: boolean;

  @Column({ default: false })
  hasFullAccess: boolean;

  @ManyToMany(() => Endpoint, { cascade: true })
  @JoinTable()
  endpoints: Endpoint[];
}
