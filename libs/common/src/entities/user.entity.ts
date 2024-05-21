import { AbstractEntity } from '../database';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Access } from './access.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  email: string;

  @Column()
  full_name?: string;

  @Column()
  hashed_password: string;

  @ManyToMany(() => Access)
  @JoinTable()
  accesses: Access[];
}
