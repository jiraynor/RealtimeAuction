import { Router, Request, Response, NextFunction } from 'express';
import { DataSource, FindOperator, Like } from 'typeorm';
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

      ///
      const authorization = req.headers.authorization;
      const token = authorization && authorization.split(' ')[1];

      const jwtSecret = 'JsonWebTokenSecret';

      const userToken = jwt.verify(token, jwtSecret);
      const id = userToken['id'];

      const member: Member = await memberRepository.findOneBy({ id });

      member.password = '********';

      ///
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
    '/get/:auction_number',
    async (req: Request, res: Response, next: NextFunction) => {
      const { auction_number } = req.params;

      const auction_num = parseInt(auction_number);

      const auction: Auction_item = await auctionRepository.findOneBy({
        auction_num,
      });

      ///
      const authorization = req.headers.authorization;
      const token = authorization && authorization.split(' ')[1];

      const jwtSecret = 'JsonWebTokenSecret';

      const userToken = jwt.verify(token, jwtSecret);
      const id = userToken['id'];

      const member: Member = await memberRepository.findOneBy({ id });

      member.password = '********';

      ///

      try {
        if (id) {
          if (auction) {
            res.status(200).json(auction);
          } else {
            res.status(422).end('실패');
          }
        } else {
          res.status(496).end('토큰 인증 실패');
        }
      } catch (e) {}
    }
  );

  // update: 경매 물건 수정
  router.patch(
    '/update',
    async (req: Request, res: Response, next: NextFunction) => {
      const {
        auction_number,
        item_name,
        item_category,
        number_of_item,
        appraisal_value,
        lowest_selling_price,
        immediate_sale_price,
        item_note,
        deadline,
      } = req.body;

      const auction_num = parseInt(auction_number);

      let auction: Auction_item = await auctionRepository.findOneBy({
        auction_num,
      });

      ///

      const authorization = req.headers.authorization;
      const token = authorization && authorization.split(' ')[1];

      const jwtSecret = 'JsonWebTokenSecret';

      const userToken = jwt.verify(token, jwtSecret);
      const id = userToken['id'];

      const member: Member = await memberRepository.findOneBy({ id });

      member.password = '********';

      ///

      auction = auctionRepository.create({
        auction_num,
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

      try {
        if (id == auction.saler.id) {
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

  // delete: 경매 물건 삭제
  router.delete(
    '/delete',
    async (req: Request, res: Response, next: NextFunction) => {
      const { auction_number } = req.body;

      const auction_num = parseInt(auction_number);

      let auction: Auction_item = await auctionRepository.findOneBy({
        auction_num,
      });

      ///

      const authorization = req.headers.authorization;
      const token = authorization && authorization.split(' ')[1];

      const jwtSecret = 'JsonWebTokenSecret';

      const userToken = jwt.verify(token, jwtSecret);
      const id = userToken['id'];

      const member: Member = await memberRepository.findOneBy({ id });

      member.password = '********';

      ///

      try {
        if (id == auction.saler.id) {
          const auction = auctionRepository.delete({ auction_num });
          res.status(200).end('성공');
        } else {
          res.status(496).end('실패');
        }
      } catch (e) {
        res.status(406).end('요청값 오류');
      }
    }
  );

  // getRegAuctions: 자신이 등록한 경매 물건 리스트
  router.get(
    '/getRegAuctions/:page',
    async (req: Request, res: Response, next: NextFunction) => {
      const { page } = req.params;

      // prettier-ignore
      let pageNum = (parseInt(page) - 1) * 10;

      ///

      const authorization = req.headers.authorization;
      const token = authorization && authorization.split(' ')[1];

      const jwtSecret = 'JsonWebTokenSecret';

      const userToken = jwt.verify(token, jwtSecret);
      const id = userToken['id'];

      const member: Member = await memberRepository.findOneBy({ id });

      ///

      try {
        if (id) {
          const auction = await auctionRepository.find({
            where: { saler: { id } },
            skip: pageNum,
            take: 10,
            order: { auction_num: 'DESC' },
          });
          res.status(200).json(auction);
        } else {
          res.status(496).end('실패');
        }
      } catch (e) {
        res.status(496).end('토큰값 오류');
      }
    }
  );

  // getAuctions: 전체 경매 물건 리스트
  router.get(
    '/getAuctions/:page',
    async (req: Request, res: Response, next: NextFunction) => {
      const { page } = req.params;

      // prettier-ignore
      let pageNum = (parseInt(page) - 1) * 10;

      const auction = await auctionRepository.find({
        skip: pageNum,
        take: 10,
        order: { auction_num: 'DESC' },
      });

      try {
        if (auction) {
          res.status(200).json(auction);
        } else {
          res.status(400).end('실패');
        }
      } catch (e) {}
    }
  );

  // getSearchAuctions: 검색 경매 물건 리스트
  router.get(
    '/getSearchAuctions',
    async (req: Request, res: Response, next: NextFunction) => {
      const { page, search } = req.params;

      // prettier-ignore
      let pageNum = (parseInt(page) - 1) * 10;
      console.log(page);
      console.log(search);
      try {
        const auction = await auctionRepository.find({
          where: { item_name: Like(`%${search}%`) },
          skip: pageNum,
          take: 10,
          order: { auction_num: 'DESC' },
        });
        res.status(200).json(auction);
      } catch (e) {
        res.status(496).end('토큰값 오류');
      }
    }
  );

  // getBidAuctions: 입찰한 경매 물건 리스트
  router.get(
    '/getBidAuctions/:page',
    async (req: Request, res: Response, next: NextFunction) => {
      console.log('getBidAuctions');
    }
  );

  return router;
};

export default auctionRouter;
