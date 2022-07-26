import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import LocalFiles from './localFiles/localFiles.entity';

import { Status } from 'src/global/global.enum';

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


  
  // 42 api
  @Column({ default: 'https://cdn.intra.42.fr/users/medium_default.png'}) avatar42: string;

  @Column({ unique: true, nullable: true }) login42: string;

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


    // user test
    @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;

    @Column({ default: false })
    public isTwoFactorAuthentificationEnabled: boolean;


    // User's email confirmation
  @Column({ type: 'text', default: false}) isEmailConfirmed: boolean;

    // User's number of victory
  @Column({ type: 'int', default: 0 }) wins: number;
    // User's number of defeats
  @Column({ type: 'int', default: 0 }) losses: number;
    // User's score
  @Column({ type: 'int', default: 0 }) score: number;

  
  @Column({ type: 'enum', enum: Status, default: Status.OFFLINE }) status: Status;


    // User's friends list
  @Column({ type: 'uuid', array: true, default: [] }) friends_list: string[];
  //   // User's role
  // @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER, }) role: UserRole;


}

// https://www.youtube.com/watch?v=r2FN1Szul1I&ab_channel=AmitavRoy
// use postman