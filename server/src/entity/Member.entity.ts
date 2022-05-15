import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Member extends BaseEntity {
  @PrimaryColumn()
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
