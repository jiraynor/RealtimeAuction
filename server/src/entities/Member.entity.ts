import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Member')
export class Member extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 225, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  tel: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  balance: number;

  @Column({ type: 'varchar', length: 15, nullable: false })
  account_num: string;

  @Column({ type: 'varchar', length: 3, nullable: false })
  bank_code: string;
}
