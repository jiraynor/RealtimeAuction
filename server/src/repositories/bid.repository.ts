import AppDataSource from '../app-data-source';
import { Bid_log } from '../entities/Bid_log.entity';
// import {  } from '../dtos/bid.dto';
import { Member } from '../entities/Member.entity';
import { Auction_item } from '../entities/Auction_item.entity';

export const BidRepository = AppDataSource.getRepository(Bid_log).extend({
  // 입찰
  set(auction: Auction_item, bider: Member, bid_price: number) {
    const bid = this.create({
      auction,
      bid_price,
      bider,
    });

    return this.save(bid);
  },

  // 즉시 매입
  immediate(auction: Auction_item, bider: Member) {
    const bid = this.create({
      auction,
      bid_price: auction.immediate_sale_price,
      bider,
    });

    return this.save(bid);
  },

  // 입찰 리스트 보기
  async getBids(auction: Auction_item) {
    return this.find({
      where: { auction },
      order: { bid_price: 'DESC' },
    });
  },
});
