import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import LocalFiles from './localFiles/localFiles.entity';

import { UserRole } from 'src/global/global.enum';

/*
**  Documentation
**  
**  https://github.com/typeorm/typeorm/blob/master/docs/entities.md#column-types
*/



@Entity()
export class User {
    // User's id, automatically generated
  @PrimaryGeneratedColumn('uuid') id: string;
    // User's creation date
  @CreateDateColumn() created: Date;
    // User's first name
  @Column({ type: 'varchar', length: 30 }) firstName: string;
    // User's last name
  @Column({ type: 'varchar', length: 30 }) lastName: string;
    // User's biography
  @Column({ type: 'varchar', length: 100, nullable: true }) biography: string;
      // User's biography
  @Column({ type: 'varchar', length: 20, nullable: true, unique: true  }) pseudo: string;

  // User's avatar
  @JoinColumn({ name: 'avatarId' })
  @OneToOne(
    () => LocalFiles,
    {
      nullable: true
    }
  )
  public avatar?: LocalFiles;

  @Column({ nullable: true })
  public avatarId?: string;

    // User's password
  @Column({ type: 'text' }) password: string;
    // User's email
  @Column({ type: 'text', nullable: true, unique: true }) email: string; 
    // True if the user is connected
  @Column({ default: false, nullable: true }) isConnected: boolean;
    // User's number of victory
  @Column({ type: 'int', default: 0 }) victory: number;
    // User's number of defeats
  @Column({ type: 'int', default: 0 }) defeat: number;
    // User's score
  @Column({ type: 'int', default: 0 }) score: number;
    // User's friends list
  @Column({ type: 'uuid', array: true, default: [] }) friends_list: string[];
    // User's role
  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER, }) role: UserRole;


}

// https://www.youtube.com/watch?v=r2FN1Szul1I&ab_channel=AmitavRoy
// use postman