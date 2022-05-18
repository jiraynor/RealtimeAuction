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
  immediate(auction: Auction_item, bider: Member, bid_price: number) {
    // 즉시 매입 눌리시 : 상품 아이디만 넘어 오면 -> 즉시 매입자 아이디
    // 1. 토큰에서 로그인 유저 아이디 받고
    // 2. auction_item 가져오고 -> if 검증
    // 3. 유저 아이디로 memeber 불러오고 -> if 검증
    // 4. bid_log create
    // 5. bid_log -> (bid_price : auction_item.immediate ~~ ) create
    // 6. auction_item 에서 낙찰여부 : true, 낙찰 금액: 즉시매입 금액, 낙찰자를 member -> 수정

    const bid = this.create({
      auction,
      bid_price,
      bider,
    });

    return this.save(bid);
  },

  // 입찰 리스트 보기
  getBids(auction: Auction_item) {
    return this.find({
      where: { auction },
      order: { bid_price: 'ASC' },
    });
  },
});
