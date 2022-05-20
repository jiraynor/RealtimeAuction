import { Router, Request, Response, NextFunction } from 'express';

import { auth } from '../utils/utility';

import {
  BidRepository,
  MemberRepository,
  AuctionRepository,
} from '../repositories';

const router: Router = Router();

// set: 입찰
router.post('/set', async (req: Request, res: Response, next: NextFunction) => {
  // 인증
  let { auction_num, bid_price } = req.body;
  const id = auth(req.headers.authorization);

  if (!id) res.status(401).send('권한없음');

  try {
    const bider = await MemberRepository.findOneBy({ id });
    const auction_item = await AuctionRepository.findOneBy({ auction_num });

    if (
      auction_item.current_price >= bid_price ||
      auction_item.appraisal_value >= bid_price ||
      bider.balance <= bid_price
    )
      res.status(400).send('금액오류');

    console.log(bid_price);
    // 입찰할때 즉시 낙찰가 보다 크면 즉시 낙찰가로만 처리
    if (auction_item.immediate_sale_price >= bid_price)
      bid_price = auction_item.immediate_sale_price;

    console.log('즉낙보다 큼 : ' + bid_price);
    if (id === auction_item.saler.id) res.status(400).send('본인상품');

    await AuctionRepository.updateCurrentPrice(
      auction_item,
      parseInt(bid_price)
    );

    const bid = await BidRepository.set(
      auction_item,
      bider,
      parseInt(bid_price)
    );
    res.status(200).send('성공');
  } catch (e) {
    console.error(e.message);
    res.status(503).end('실패');
  }
});

// immdediate: 즉시 매입
router.post(
  '/immediate',
  async (req: Request, res: Response, next: NextFunction) => {
    const { auction_num } = req.body;
    const id = auth(req.headers.authorization);

    if (!id) res.status(401).send('권한없음');

    try {
      const bider = await MemberRepository.findOneBy({ id });
      const auction_item = await AuctionRepository.findOneBy({ auction_num });

      if (id === auction_item.saler.id) res.status(400).send('본인상품');

      if (
        auction_item.auction_status === false ||
        auction_item.successful_bid_status === false
      )
        res.status(400).send('경매시작전');

      await BidRepository.immediate(auction_item, bider);

      await AuctionRepository.updateAuctionSuccessful(auction_item, bider);

      res.status(200).send('성공');
    } catch (e) {
      console.error(e.message);
      res.status(503).end('실패');
    }
  }
);

// getBids: 입찰 리스트 보기
router.get('/getBids', async (req: Request, res: Response) => {
  const id = auth(req.headers.authorization);

  if (!id) res.status(401).send('권한없음');

  try {
    // res.status(200).json(bidList);
  } catch (e) {
    console.error(e.message);
    res.status(503).end('실패');
  }
});

export default router;
