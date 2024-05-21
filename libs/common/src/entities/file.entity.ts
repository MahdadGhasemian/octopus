import { AbstractEntity } from '../database';
import { Column, Entity } from 'typeorm';

@Entity()
export class File extends AbstractEntity<File> {
  @Column()
  file_name: string;

  @Column()
  file_path: string;

  @Column({ default: false })
  cannotBeDeleted: boolean;

  @Column({ default: false })
  hasFullAccess: boolean;

  user_ids: number[];
}
