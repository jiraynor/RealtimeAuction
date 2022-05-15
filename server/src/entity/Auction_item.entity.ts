import { BaseEntity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './Member.entity';

export class Auction_item extends BaseEntity {
  // 물건 번호
  @PrimaryGeneratedColumn()
  auction_num: number;

  // 물건 이름
  @Column({ type: 'string', nullable: false, length: 100 })
  item_name: string;

  // 물건 종류
  @Column({ type: 'string', nullable: false, length: 20 })
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

  @Column({ type: 'datetime', nullable: false })
  deadline: string;

  @ManyToOne(() => Member, (member) => member.id, {
    eager: true,
    nullable: false,
  })
  saler_id: string;

  @Column({ nullable: false, default: false })
  successful_bid_status: boolean;

  @ManyToOne(() => Member, (member) => member.id, {
    eager: true,
  })
  successful_bidder_id: String;

  @Column({ type: 'int', default: null })
  successful_bid_price: number;

  @Column({ type: 'datetime', default: null })
  successful_bid_datetime: string;
}
