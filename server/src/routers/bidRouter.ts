import { Router, Request, Response, NextFunction } from 'express';
import { DataSource, FindOperator, Like } from 'typeorm';
import { Auction_item } from '../entities/Auction_item.entity';
import { Member } from '../entities/Member.entity';
import { Bid_log } from '../entities/Bid_log.entity';

import * as cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { send } from 'process';

const bidRouter = (datasource: DataSource) => {
  const memberRepository = datasource.getRepository(Member);
  const auctionRepository = datasource.getRepository(Auction_item);
  const bidLogRepository = datasource.getRepository(Bid_log);
  const router: Router = Router();

  // set: 입찰
  router.post(
    '/set',
    async (req: Request, res: Response, next: NextFunction) => {
      const {} = req.body;

      const bidLog = bidLogRepository.create;
    }
  );

  // immdediate: 즉시 매입
  router.post(
    '/immediate',
    async (req: Request, res: Response, next: NextFunction) => {
      console.log('immediate');
    }
  );

  // getBids: 입찰 리스트 보기
  router.get(
    '/getBids',
    async (req: Request, res: Response, next: NextFunction) => {
      console.log('getBids');
    }
  );

  return router;
};

export default bidRouter;
