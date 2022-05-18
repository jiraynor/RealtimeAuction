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

router.post('/regist', async (req: Request, res: Response) => {
  const dto = req.body;

  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  try {
    const member: Member = await MemberRepository.findOneBy({ id });
    await AuctionRepository.regist(dto, member);
    const auction_list = await AuctionRepository.getPageList(1);
    setBlinds(auction_list);

    res.status(200).json(auction_list);
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

router.get('/get/:auction_number', async (req: Request, res: Response) => {
  const { auction_number } = req.params;

  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  try {
    const auction_num = parseInt(auction_number);
    const auction_item: Auction_item = await AuctionRepository.findOneBy({
      auction_num,
    });
    setBlind(auction_item);

    res.status(200).json(auction_item);
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
    const auction_item = await AuctionRepository.updateAuction(dto, member);
    setBlind(auction_item);

    res.status(200).json(auction_item);
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

router.delete('/delete', async (req: Request, res: Response) => {
  const { auction_num } = req.body;

  const auction = await AuctionRepository.findOneBy({
    auction_num,
  });

  const id = auth(req.headers.authorization);
  if (!id || auction.saler.id !== id) res.status(401).send('권한없음');

  try {
    await AuctionRepository.delete({ auction_num });
    const auction_list = await AuctionRepository.getPageList(1);
    setBlinds(auction_list);

    res.status(200).json(auction_list);
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

router.get('/getAuctions/:page', async (req: Request, res: Response) => {
  const { page } = req.params;

  try {
    const auction_list = await AuctionRepository.getPageList(parseInt(page));
    setBlinds(auction_list);

    res.status(200).json(auction_list);
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

router.get(
  '/getSearchAuctions/:page/:search',
  async (req: Request, res: Response) => {
    const { page, search } = req.params;

    try {
      const auction_list = await AuctionRepository.getPageLikeList(
        parseInt(page),
        search
      );
      setBlinds(auction_list);

      res.status(200).json(auction_list);
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
    const member: Member = await MemberRepository.findOneBy({ id });
    const auction_list = await AuctionRepository.getPageBidList(
      parseInt(page),
      member
    );
    setBlinds(auction_list);

    res.status(200).json(auction_list);
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

export default router;
