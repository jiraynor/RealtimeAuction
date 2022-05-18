import { Router, Request, Response } from 'express';

import { auth } from '../utils/utility';
import { MemberRepository, AuctionRepository } from '../repositories';
import { Auction_item, Member } from '../entities';

const router: Router = Router();

router.post('/regist', async (req: Request, res: Response) => {
  const { pageType, ...dto } = req.body;

  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  //  pageType = 'all', pageType = 'my'
  try {
    const member: Member = await MemberRepository.findOneBy({ id });
    await AuctionRepository.regist(dto, member);

    const auction_list =
      pageType === 'all'
        ? await AuctionRepository.getPageList(1)
        : await AuctionRepository.getPageSalerList(1, member);

    res.status(200).json(/*auction_list*/ {});
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

    const auction_item = await AuctionRepository.update(dto, member);

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

    res.status(200).json(auction_list);
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

router.get('/getAuctions/:page', async (req: Request, res: Response) => {
  const { page } = req.params;

  try {
    const auction_list = await AuctionRepository.getPageList(parseInt(page));

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
      const Auction_list = await AuctionRepository.getPageLikeList(
        parseInt(page),
        search
      );
      res.status(200).json(Auction_list);
    } catch (e) {
      res.status(503).send('데이터베이스 오류');
    }
  }
);

router.get('/getBidAuctions/:page', async (req: Request, res: Response) => {
  const { page } = req.params;

  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  const member: Member = await MemberRepository.findOneBy({ id });
});

export default router;
