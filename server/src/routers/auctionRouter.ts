import { Router } from 'express';
import { DataSource } from 'typeorm';

const auctionRouter = (datasource: DataSource) => {
  const router: Router = Router();

  router.post('/regist', (req, res, next) => {
    console.log('auctionRegsit');
  });

  router.get('/get', (req, res, next) => {
    console.log('getAuction');
  });

  router.patch('/update', (req, res, next) => {
    console.log('deleteAuction');
  });

  router.delete('/delete', (req, res, next) => {
    console.log('deleteAuction');
  });

  router.get('/getRegAuctions', (req, res, next) => {
    console.log('getRegAuctions');
  });

  router.get('/getAuctions', (req, res, next) => {
    console.log('getAuctions');
  });

  router.get('/getSearchAuctions', (req, res, next) => {
    console.log('getSearchAuctions');
  });

  router.get('/getBidAuctions', (req, res, next) => {
    console.log('getBidAuctions');
  });

  return router;
};

export default auctionRouter;
