import { BaseEntity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auction_item } from './Auction_item';
import { Member } from './Member.entity';

export class Bid_log extends BaseEntity {
  @PrimaryGeneratedColumn()
  log_num: number;

  @ManyToOne(() => Member, (member) => member.id, { eager: true })
  bider: Member;

  @ManyToOne(() => Auction_item, (auction_item) => auction_item.auction_num, {
    eager: true,
  })
  auction: Auction_item;

  @Column({ type: 'int', nullable: false })
  bid_price: number;

  @Column({ type: 'datetime', nullable: false })
  bid_datetime: string;
}
