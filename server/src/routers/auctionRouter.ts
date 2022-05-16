import { Router, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Auction_item } from '../entity/Auction_item.entity';
import { Member } from '../entity/Member.entity';

import * as cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { send } from 'process';

const auctionRouter = (datasource: DataSource) => {
  const memberRepository = datasource.getRepository(Member);
  const auctionRepository = datasource.getRepository(Auction_item);
  const router: Router = Router();

  // regist: 경매 물건 등록
  router.post(
    '/regist',
    async (req: Request, res: Response, next: NextFunction) => {
      const {
        item_name,
        item_category,
        number_of_item,
        appraisal_value,
        lowest_selling_price,
        immediate_sale_price,
        item_note,
        deadline,
      } = req.body;

      const authorization = req.headers.authorization;
      const token = authorization && authorization.split(' ')[1];

      const jwtSecret = 'JsonWebTokenSecret';

      const userToken = jwt.verify(token, jwtSecret);
      const id = userToken['id'];

      const member: Member = await memberRepository.findOneBy({ id });

      member.password = '********';

      console.log(id);
      console.log(member);
      const auction = auctionRepository.create({
        item_name,
        item_category,
        number_of_item,
        appraisal_value,
        lowest_selling_price,
        immediate_sale_price,
        item_note,
        deadline,
        saler: member,
      });

      console.log(auction);

      try {
        if (id) {
          if (auction) {
            await auctionRepository.save(auction);
            res.status(200).end('성공');
          } else {
            res.status(422).end('실패');
          }
        } else {
          res.status(496).end('토큰 인증 실패');
        }
      } catch (e) {}
    }
  );

  // get: 경매 물건 보기
  router.get(
    '/get',
    async (req: Request, res: Response, next: NextFunction) => {
      console.log('getAuction');
    }
  );

  // update: 경매 물건 수정
  router.patch(
    '/update',
    async (req: Request, res: Response, next: NextFunction) => {
      console.log('deleteAuction');
    }
  );

  // delete: 경매 물건 삭제
  router.delete(
    '/delete',
    async (req: Request, res: Response, next: NextFunction) => {
      console.log('deleteAuction');
    }
  );

  // getRegAuctions: 자신이 등록한 경매 물건 리스트
  router.get(
    '/getRegAuctions',
    async (req: Request, res: Response, next: NextFunction) => {
      console.log('getRegAuctions');
    }
  );

  // getAuctions: 전체 경매 물건 리스트
  router.get(
    '/getAuctions',
    async (req: Request, res: Response, next: NextFunction) => {
      console.log('getAuctions');
    }
  );

  // getSearchAuctions: 검색 경매 물건 리스트
  router.get(
    '/getSearchAuctions',
    async (req: Request, res: Response, next: NextFunction) => {
      console.log('getSearchAuctions');
    }
  );

  // getBidAuctions: 입찰한 경매 물건 리스트
  router.get(
    '/getBidAuctions',
    async (req: Request, res: Response, next: NextFunction) => {
      console.log('getBidAuctions');
    }
  );

  return router;
};

export default auctionRouter;
