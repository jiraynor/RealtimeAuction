import { Router } from 'express';

const auctionRouter: Router = Router();

auctionRouter.post('/regist', (req, res, next) => {
  console.log('auctionRegsit');
});

auctionRouter.get('/get', (req, res, next) => {
  console.log('getAuction');
});

auctionRouter.patch('/update', (req, res, next) => {
  console.log('deleteAuction');
});

auctionRouter.delete('/delete', (req, res, next) => {
  console.log('deleteAuction');
});

auctionRouter.get('/getRegAuctions', (req, res, next) => {
  console.log('getRegAuctions');
});

auctionRouter.get('/getAuctions', (req, res, next) => {
  console.log('getAuctions');
});

auctionRouter.get('/getSearchAuctions', (req, res, next) => {
  console.log('getSearchAuctions');
});

auctionRouter.get('/getBidAuctions', (req, res, next) => {
  console.log('getBidAuctions');
});

export default auctionRouter;
