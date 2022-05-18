import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bid_log } from './Bid_log.entity';
import { Item_img } from './Item_img.entity';
import { Member } from './Member.entity';

@Entity('Auction_item')
export class Auction_item extends BaseEntity {
  // 물건 번호
  @PrimaryGeneratedColumn()
  auction_num: number;

  // 물건 이름
  @Column({ type: 'varchar', nullable: false, length: 100 })
  item_name: string;

  // 물건 종류
  @Column({ type: 'varchar', nullable: false, length: 20 })
  item_category: string;

  // 물건 수량
  @Column({ type: 'int', nullable: false })
  number_of_item: number;

  // 감정 평가액
  @Column({ type: 'int', nullable: false })
  appraisal_value: number;

  // 최저 매각 가격
  @Column({ type: 'int', nullable: false })
  lowest_selling_price: number;

  // 즉시 매입 가격
  @Column({ type: 'int', default: null })
  immediate_sale_price: number;

  // 물건 비고
  @Column({ type: 'text', nullable: false })
  item_note: string;

  // 경매 시작 여부
  @Column({ nullable: false, default: false })
  auction_status: boolean;

  // 등록일
  @Column({ type: 'datetime', nullable: false, default: () => 'now()' })
  reg_datetime: string;

  // 마감일
  @Column({ type: 'datetime', nullable: false })
  deadline: string;

  // 현재 금액
  @Column({ type: 'int', default: 0 })
  current_price: number;

  // 판매자 아이디
  @ManyToOne(() => Member, (member) => member.id, {
    eager: true,
    nullable: false,
  })
  saler: Member;

  // 낙찰 여부
  @Column({ nullable: false, default: false })
  successful_bid_status: boolean;

  // 낙찰자 아이디
  @ManyToOne(() => Member, (member) => member.id, {
    eager: true,
  })
  successful_bidder: Member;

  // 낙찰 가격
  @Column({ type: 'int', default: null })
  successful_bid_price: number;

  // 낙찰일
  @Column({ type: 'datetime', default: null })
  successful_bid_datetime: string;

  @OneToMany(() => Bid_log, (bid_log) => bid_log.log_num)
  bids: Bid_log[];

  @OneToMany(() => Item_img, (item_img) => item_img.img_num)
  images: Item_img[];
}
