import AppDataSource from '../app-data-source';
import { Bid_log } from '../entities/Bid_log.entity';
// import {  } from '../dtos/bid.dto';
import { Member } from '../entities/Member.entity';
import { Auction_item } from '../entities/Auction_item.entity';

export const BidRepository = AppDataSource.getRepository(Bid_log).extend({
  // 입찰
  set(bid_price: number, bider: Member, auction: Auction_item) {
    const bid = this.create({
      auction,
      bid_price,
      bider,
    });

    return this.save(bid);
  },

  // immediate(auction_num, bider, bid_price)
});
