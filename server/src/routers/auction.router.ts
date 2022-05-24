import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { authAccessToken } from '../utils/utility';
import {
  MemberRepository,
  AuctionRepository,
  BidRepository,
  ItemImgRepository,
} from '../repositories';
import { Auction_item, Bid_log, Member } from '../entities';
import { FindOptionsWhere } from 'typeorm';

const router: Router = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'server/auction_images/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const setBlinds = (auction_list: Auction_item[]) => {
  for (let auction of auction_list) {
    auction.saler.password = '********';
    auction.saler.address = '********';
    auction.saler.tel = '********';
    auction.saler.balance = 0;
    auction.saler.account_num = '********';
    auction.saler.bank_code = '********';
  }
};

const setBlind = (auction: Auction_item) => {
  auction.saler.password = '********';
  auction.saler.address = '********';
  auction.saler.tel = '********';
  auction.saler.balance = 0;
  auction.saler.account_num = '********';
  auction.saler.bank_code = '********';
};

const pagination = (count: number, pageNum: number) => {
  const cnt = parseInt(count / 10 + '') + 1;
  const section = parseInt((pageNum - 1) / 5 + '') + 1;
  const hasNext = cnt > section * 5;
  const next = hasNext ? section * 5 + 1 : 0;
  const max = hasNext ? section * 5 : cnt;
  const hasPrev = section != 1;
  const prev = hasPrev ? (section - 1) * 5 : 0;
  const min = (section - 1) * 5 + 1;
  return {
    hasNext,
    next,
    max,
    hasPrev,
    prev,
    min,
  };
};

router.post(
  '/regist',
  upload.array('images'),
  async (req: Request, res: Response) => {
    const dto = req.body;
    const images = req.files;

    const id = authAccessToken(req.headers.authorization);
    // 빈 토큰
    if (id === '-1')
      return res.status(496).json({ state: false, message: 'Empty Token.' });
    // 기간 만료
    else if (id === '0')
      return res.status(402).json({ state: false, message: 'Expired Token.' });
    // 잘못된 토큰
    else if (id === '1')
      return res.status(495).json({ state: false, message: 'Invalid Token.' });

    try {
      const {
        number_of_item,
        appraisal_value,
        lowest_selling_price,
        immediate_sale_price,
        deadline,
      } = dto;

      // 잘못된 입력
      if (
        parseInt(number_of_item) < 1 ||
        parseInt(appraisal_value) < 1 ||
        parseInt(lowest_selling_price) < 1 ||
        parseInt(immediate_sale_price) < 0
      )
        return res
          .status(406)
          .json({ state: false, message: 'Invalid Input.' });

      // 잘못된 금액
      if (
        parseInt(immediate_sale_price) > 0 &&
        parseInt(lowest_selling_price) >= parseInt(immediate_sale_price)
      )
        return res
          .status(406)
          .json({ state: false, message: 'Invalid Amount.' });

      // 잘못된 날짜
      if (new Date(deadline) <= new Date())
        return res.status(406).json({ state: false, message: 'Invalid Date.' });

      const PAGE_NUMBER = 1;
      const member: Member = await MemberRepository.findOneBy({ id });
      const auction = await AuctionRepository.regist(dto, member);

      for (let i = 0; i < images.length; i++)
        await ItemImgRepository.set(
          images[i].filename,
          auction.generatedMaps[0] as Auction_item
        );

      const count = await AuctionRepository.count();
      const auction_list = await AuctionRepository.getPageList(PAGE_NUMBER);
      setBlinds(auction_list);

      // 성공
      return res
        .status(200)
        .json({ auction_list, pagination: pagination(count, PAGE_NUMBER) });
    } catch (e) {
      // 데이터베이스 오류
      return res.status(503).json({ state: false, message: 'Database Error.' });
    }
  }
);

router.get('/get/:auction_number', async (req: Request, res: Response) => {
  const { auction_number } = req.params;

  try {
    const auction_num = parseInt(auction_number);
    const auction_item: Auction_item = await AuctionRepository.findOneBy({
      auction_num,
    });

    console.log(typeof auction_item.deadline);

    const item_imgs = await ItemImgRepository.getImgs(auction_item);

    const bid_logs: Bid_log[] = await BidRepository.getBids(auction_item);
    setBlind(auction_item);

    return res.status(200).json({ auction_item, bid_logs, item_imgs });
  } catch (e) {
    return res.status(503).json({ state: false, message: 'Database Error' });
  }
});

router.patch('/update', async (req: Request, res: Response) => {
  const dto = req.body;

  const id = authAccessToken(req.headers.authorization);
  // 빈 토큰
  if (id === '-1')
    return res.status(496).json({ state: false, message: 'Empty Token.' });
  // 기간 만료
  else if (id === '0')
    return res.status(402).json({ state: false, message: 'Expired Token.' });
  // 잘못된 토큰
  else if (id === '1')
    return res.status(495).json({ state: false, message: 'Invalid Token.' });

  try {
    const {
      number_of_item,
      appraisal_value,
      lowest_selling_price,
      immediate_sale_price,
      deadline,
    } = dto;

    // 잘못된 입력
    if (
      number_of_item < 1 ||
      appraisal_value < 1 ||
      lowest_selling_price < 1 ||
      immediate_sale_price < 0
    )
      return res.status(406).json({ state: false, message: 'Invalid Input.' });

    // 잘못된 금액
    if (
      immediate_sale_price > 0 &&
      lowest_selling_price >= immediate_sale_price
    )
      return res.status(406).json({ state: false, message: 'Invalid Amount.' });

    // 잘못된 날짜
    if (new Date(deadline) <= new Date())
      return res.status(406).json({ state: false, message: 'Invalid Date.' });

    const auction_num = dto.auction_num;
    const auction = await AuctionRepository.findOneBy({ auction_num });

    // 권한 없음
    if (auction.saler.id !== id)
      return res.status(403).json({ state: false, message: 'No Permissions.' });

    const member: Member = await MemberRepository.findOneBy({ id });
    await AuctionRepository.updateAuction(dto, member);
    const auction_item = await AuctionRepository.findOneBy({ auction_num });
    setBlind(auction_item);

    // 성공
    return res.status(200).json({ auction_item });
  } catch (e) {
    // 데이터베이스 오류
    return res.status(503).json({ state: false, message: 'Database Error.' });
  }
});

router.patch('/start', async (req: Request, res: Response) => {
  const { auction_num } = req.body;

  const id = authAccessToken(req.headers.authorization);
  // 빈 토큰
  if (id === '-1')
    return res.status(496).json({ state: false, message: 'Empty Token.' });
  // 기간 만료
  else if (id === '0')
    return res.status(402).json({ state: false, message: 'Expired Token.' });
  // 잘못된 토큰
  else if (id === '1')
    return res.status(495).json({ state: false, message: 'Invalid Token.' });

  try {
    const auction = await AuctionRepository.findOneBy({ auction_num });

    // 권한 없음
    if (auction.saler.id !== id)
      return res.status(403).json({ state: false, message: 'No Permissions.' });

    await AuctionRepository.startAuction(auction);
    const auction_item = await AuctionRepository.findOneBy({ auction_num });
    setBlind(auction_item);

    // 성공
    return res.status(200).json({ auction_item });
  } catch (e) {
    // 데이터베이스 오류
    return res.status(503).json({ state: false, message: 'Database Error.' });
  }
});

router.delete('/delete/:auction_num', async (req: Request, res: Response) => {
  const { auction_num } = req.params;

  const auction = await AuctionRepository.findOneBy({
    auction_num: parseInt(auction_num),
  });

  const id = authAccessToken(req.headers.authorization);
  // 빈 토큰
  if (id === '-1')
    return res.status(496).json({ state: false, message: 'Empty Token.' });
  // 기간 만료
  else if (id === '0')
    return res.status(402).json({ state: false, message: 'Expired Token.' });
  // 잘못된 토큰
  else if (id === '1')
    return res.status(495).json({ state: false, message: 'Invalid Token.' });
  // 권한 없음
  else if (auction.saler.id !== id)
    return res.status(403).json({ state: false, message: 'No Permissions.' });

  try {
    const PAGE_NUMBER = 1;
    const imgs = await ItemImgRepository.findBy({
      auction_item: auction as FindOptionsWhere<Auction_item>,
    });

    for (let item_img of imgs) {
      // 서버 오류
      if (
        !fs.existsSync(
          path.join(path.resolve('server/auction_images'), item_img.img)
        )
      )
        return res
          .status(500)
          .json({ state: false, message: 'Not Existed Images.' });

      fs.unlink(
        path.join('server/auction_images', item_img.img),
        function (err) {
          if (err) {
            // 이미지 삭제 오류
            return res
              .status(500)
              .json({ state: false, message: 'Delete Image Fail.' });
          }
        }
      );
    }

    await ItemImgRepository.delete({
      auction_item: auction as FindOptionsWhere<Auction_item>,
    });
    await AuctionRepository.delete({ auction_num: parseInt(auction_num) });
    const count = await AuctionRepository.count();
    const auction_list = await AuctionRepository.getPageList(PAGE_NUMBER);
    setBlinds(auction_list);

    // 성공
    return res
      .status(200)
      .json({ auction_list, pagination: pagination(count, PAGE_NUMBER) });
  } catch (e) {
    // 데이터베이스 오류
    return res.status(503).json({ state: false, message: 'Database Error.' });
  }
});

router.get('/getAuctions/:page', async (req: Request, res: Response) => {
  const { page } = req.params;

  try {
    const count = await AuctionRepository.count();
    const auction_list = await AuctionRepository.getPageList(parseInt(page));
    setBlinds(auction_list);

    // 성공
    return res
      .status(200)
      .json({ auction_list, pagination: pagination(count, parseInt(page)) });
  } catch (e) {
    // 데이터베이스 오류
    return res.status(503).json({ state: false, message: 'Database Error.' });
  }
});

router.get(
  '/getSearchAuctions/:page/:search',
  async (req: Request, res: Response) => {
    const { page, search } = req.params;

    try {
      const count = await AuctionRepository.getPageLikeListCount(search);
      const auction_list = await AuctionRepository.getPageLikeList(
        parseInt(page),
        search
      );
      setBlinds(auction_list);

      // 성공
      return res
        .status(200)
        .json({ auction_list, pagination: pagination(count, parseInt(page)) });
    } catch (e) {
      // 데이터베이스 오류
      return res.status(503).json({ state: false, message: 'Database Error.' });
    }
  }
);

router.get('/getBidAuctions/:page', async (req: Request, res: Response) => {
  const { page } = req.params;

  const id = authAccessToken(req.headers.authorization);
  // 빈 토큰
  if (id === '-1')
    return res.status(496).json({ state: false, message: 'Empty Token.' });
  // 기간 만료
  else if (id === '0')
    return res.status(402).json({ state: false, message: 'Expired Token.' });
  // 잘못된 토큰
  else if (id === '1')
    return res.status(495).json({ state: false, message: 'Invalid Token.' });

  try {
    const saler: Member = await MemberRepository.findOneBy({ id });
    const count = await AuctionRepository.getPageBidListCount(saler);
    const auction_list = await AuctionRepository.getPageBidList(
      parseInt(page),
      saler
    );
    setBlinds(auction_list);

    // 성공
    return res
      .status(200)
      .json({ auction_list, pagination: pagination(count, parseInt(page)) });
  } catch (e) {
    // 데이터베이스 오류
    return res.status(503).json({ state: false, message: 'Database Error.' });
  }
});

router.get('/getMyAuctions/:page', async (req: Request, res: Response) => {
  const { page } = req.params;

  const id = authAccessToken(req.headers.authorization);
  // 빈 토큰
  if (id === '-1')
    return res.status(496).json({ state: false, message: 'Empty Token.' });
  // 기간 만료
  else if (id === '0')
    return res.status(402).json({ state: false, message: 'Expired Token.' });
  // 잘못된 토큰
  else if (id === '1')
    return res.status(495).json({ state: false, message: 'Invalid Token.' });

  try {
    const saler = await MemberRepository.findOneBy({ id });
    const count = await AuctionRepository.getPageSalerListCount(saler);
    const auction_list = await AuctionRepository.getPageSalerList(
      parseInt(page),
      saler
    );
    setBlinds(auction_list);

    // 성공
    return res
      .status(200)
      .json({ auction_list, pagination: pagination(count, parseInt(page)) });
  } catch (e) {
    // 데이터베이스 오류
    return res.status(503).json({ state: false, message: 'Database Error.' });
  }
});

export default router;
