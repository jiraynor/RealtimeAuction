import { Auction_item, Bid_log } from '../entities';
import {
  AuctionRepository,
  BidRepository,
  MemberRepository,
} from '../repositories';

const setBlinds = (bid_logs: Bid_log[]) => {
  for (let bid_log of bid_logs) {
    bid_log.bider.password = '********';
    bid_log.bider.address = '********';
    bid_log.bider.tel = '********';
    bid_log.bider.balance = 0;
    bid_log.bider.account_num = '********';
    bid_log.bider.bank_code = '********';
  }
};

export async function setBid(
  auction_num: number,
  bid_price: number,
  id: string
) {
  // 아이디 가져오기
  const bider = await MemberRepository.findOneBy({ id });
  // 상품 가져오기
  const auction: Auction_item = await AuctionRepository.findOneBy({
    auction_num,
  });

  // 가격 오버 검증
  if (
    auction.current_price >= bid_price ||
    auction.lowest_selling_price >= bid_price
  )
    return { status: 400, message: '금액 오류', value: [] };

  // 본인상품 막기
  if (id === auction.saler.id)
    return { status: 400, message: '본인 물건', value: [] };

  // bid_log 넣기
  await BidRepository.set(auction, bider, bid_price);

  // auction_item.current_price update
  await AuctionRepository.updateCurrentPrice(auction, bid_price);

  const bid_logs = await BidRepository.getBids(auction);
  setBlinds(bid_logs);

  return { status: 200, message: '성공', value: bid_logs };
}
