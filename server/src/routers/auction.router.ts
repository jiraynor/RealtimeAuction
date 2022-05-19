import { Router, Request, Response } from 'express';

import { auth } from '../utils/utility';
import { MemberRepository, AuctionRepository } from '../repositories';
import { Auction_item, Member } from '../entities';

const router: Router = Router();

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

const getPageNum = (count: number) => parseInt(count / 10 + '') + 1;

const pagination = (count: number, pageNum: number) => {
  const cnt = parseInt(count / 10 + '') + 1;
  const section = (pageNum - 1) / 5 + 1;
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

router.post('/regist', async (req: Request, res: Response) => {
  const dto = req.body;

  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  try {
    const PAGE_NUMBER = 1;
    const member: Member = await MemberRepository.findOneBy({ id });
    await AuctionRepository.regist(dto, member);
    const count = await AuctionRepository.count();
    const auction_list = await AuctionRepository.getPageList(PAGE_NUMBER);
    setBlinds(auction_list);

    res
      .status(200)
      .json({ auction_list, pagination: pagination(count, PAGE_NUMBER) });
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

router.get('/get/:auction_number', async (req: Request, res: Response) => {
  const { auction_number } = req.params;

  try {
    const auction_num = parseInt(auction_number);
    const auction_item: Auction_item = await AuctionRepository.findOneBy({
      auction_num,
    });
    setBlind(auction_item);

    res.status(200).json({ auction_item });
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

router.patch('/update', async (req: Request, res: Response) => {
  const dto = req.body;

  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  try {
    const auction_num = dto.auction_num;
    const auction = await AuctionRepository.findOneBy({ auction_num });
    if (auction.saler.id !== id) res.status(401).send('권한없음');

    const member: Member = await MemberRepository.findOneBy({ id });
    await AuctionRepository.updateAuction(dto, member);
    const auction_item = await AuctionRepository.findOneBy({ auction_num });
    setBlind(auction_item);

    res.status(200).json({ auction_item });
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

router.patch('/start', async (req: Request, res: Response) => {
  const { auction_num } = req.body;

  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  try {
    const auction = await AuctionRepository.findOneBy({ auction_num });
    if (auction.saler.id !== id) res.status(401).send('권한없음');

    await AuctionRepository.startAuction(auction);
    const auction_item = await AuctionRepository.findOneBy({ auction_num });
    setBlind(auction_item);

    res.status(200).json({ auction_item });
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

router.delete('/delete/:auction_num', async (req: Request, res: Response) => {
  const { auction_num } = req.params;

  const auction = await AuctionRepository.findOneBy({
    auction_num: parseInt(auction_num),
  });

  const id = auth(req.headers.authorization);
  if (!id || auction.saler.id !== id) res.status(401).send('권한없음');

  try {
    const PAGE_NUMBER = 1;
    await AuctionRepository.delete({ auction_num: parseInt(auction_num) });
    const count = await AuctionRepository.count();
    const auction_list = await AuctionRepository.getPageList(PAGE_NUMBER);
    setBlinds(auction_list);

    res
      .status(200)
      .json({ auction_list, pagination: pagination(count, PAGE_NUMBER) });
  } catch (e) {
    console.log(e.message);
    res.status(503).send('데이터베이스 오류');
  }
});

router.get('/getAuctions/:page', async (req: Request, res: Response) => {
  const { page } = req.params;

  try {
    const count = await AuctionRepository.count();
    const auction_list = await AuctionRepository.getPageList(parseInt(page));
    setBlinds(auction_list);

    res
      .status(200)
      .json({ auction_list, pagination: pagination(count, parseInt(page)) });
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

router.get(
  '/getSearchAuctions/:page/:search',
  async (req: Request, res: Response) => {
    const { page, search } = req.params;

    try {
      const PAGE_NUMBER = 1;
      const count = await AuctionRepository.getPageLikeListCount(search);
      const auction_list = await AuctionRepository.getPageLikeList(
        parseInt(page),
        search
      );
      setBlinds(auction_list);

      res
        .status(200)
        .json({ auction_list, pagination: pagination(count, parseInt(page)) });
    } catch (e) {
      res.status(503).send('데이터베이스 오류');
    }
  }
);

router.get('/getBidAuctions/:page', async (req: Request, res: Response) => {
  const { page } = req.params;

  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  try {
    const saler: Member = await MemberRepository.findOneBy({ id });
    const count = await AuctionRepository.getPageBidListCount(saler);
    const auction_list = await AuctionRepository.getPageBidList(
      parseInt(page),
      saler
    );
    setBlinds(auction_list);

    res
      .status(200)
      .json({ auction_list, pagination: pagination(count, parseInt(page)) });
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

router.get('/getMyAuctions/:page', async (req: Request, res: Response) => {
  const { page } = req.params;

  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  try {
    const PAGE_NUMBER = 1;
    const saler = await MemberRepository.findOneBy({ id });
    const count = await AuctionRepository.getPageSalerListCount(saler);
    const auction_list = await AuctionRepository.getPageSalerList(
      parseInt(page),
      saler
    );
    setBlinds(auction_list);

    res.status(200).json({ auction_list, page_count: getPageNum(count) });
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

export default router;
