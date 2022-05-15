import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

// typeORM
@Entity()
export class Member extends BaseEntity {
  // primaryColumn : Basic PK
  // PrimaryGeneratedColumn : Auto Increment PK
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  password: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  tel: string;

  @Column()
  email: string;

  @Column()
  balance: number;

  @Column()
  account_num: string;

  @Column()
  bank_code: string;
}
