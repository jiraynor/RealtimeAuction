import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './Member.entity';

@Entity()
export class Bid_log extends BaseEntity {
  @PrimaryGeneratedColumn()
  log_num: number;

  @ManyToOne(() => Member, (member) => member.id, { eager: true })
  bider: Member;

  @Column({ type: 'int', nullable: false })
  bid_price: number;

  @Column({ type: 'datetime', nullable: false })
  bid_datetime: string;
}
