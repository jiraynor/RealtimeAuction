import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auction_item } from './Auction_item.entity';

@Entity('Item_img')
export class Item_img extends BaseEntity {
  // 이미지 번호
  @PrimaryGeneratedColumn()
  img_num: number;

  // 이미지
  @Column({ type: 'text', nullable: false })
  img: string;

  // 물건 번호
  @ManyToOne(() => Auction_item, (Auction_item) => Auction_item.auction_num, {
    eager: true,
  })
  auction_num: number;
}
