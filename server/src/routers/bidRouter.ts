import { Router, Request, Response, NextFunction } from 'express';
import { DataSource, MaxKey } from 'typeorm';
import { Auction_item } from '../entities/Auction_item.entity';
import { Member } from '../entities/Member.entity';
import { Bid_log } from '../entities/Bid_log.entity';

import { auth } from '../utils/utility';

import * as cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { BidRepository } from '../repositories/bid.repository';
import { memberRouter } from '.';
import { MemberRepository } from '../repositories/member.repository';
import { AuctionRepository } from '../repositories/auction.repository';

const router: Router = Router();

// set: 입찰
router.post('/set', async (req: Request, res: Response, next: NextFunction) => {
  const { auction_num, bid_price } = req.body;
  const id = auth(req.headers.authorization);

  if (!id) res.status(401).send('권한없음');

  try {
    const bider = await MemberRepository.findOneBy({ id });
    const auction_item = await AuctionRepository.findOneBy({ auction_num });

    const bid = await BidRepository.set(bid_price, bider, auction_item);

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
    // req :  auction_num, bider, bid_price

    const { auction_num, bider, bid_price } = req.body;
    const id = auth(req.headers.authorization);

    if (!id) res.status(401).send('권한없음');

    try {
      res.status(200).send('성공');
    } catch (e) {
      console.error(e.message);
      res.status(503).end('실패');
    }
  }
);

// getBids: 입찰 리스트 보기
router.get(
  '/getBids',
  async (req: Request, res: Response, next: NextFunction) => {
    // req : auction_num
    // res : log_num, auction_num, bider, bid_price, bid_datetime
  }
);

export default router;
