import { Router } from 'express';
import { DataSource } from 'typeorm';

const auctionRouter = (datasource: DataSource) => {
  const roter: Router = Router();

  roter.post('/regist', (req, res, next) => {
    console.log('auctionRegsit');
  });

  roter.get('/get', (req, res, next) => {
    console.log('getAuction');
  });

  roter.patch('/update', (req, res, next) => {
    console.log('deleteAuction');
  });

  roter.delete('/delete', (req, res, next) => {
    console.log('deleteAuction');
  });

  roter.get('/getRegAuctions', (req, res, next) => {
    console.log('getRegAuctions');
  });

  roter.get('/getAuctions', (req, res, next) => {
    console.log('getAuctions');
  });

  roter.get('/getSearchAuctions', (req, res, next) => {
    console.log('getSearchAuctions');
  });

  roter.get('/getBidAuctions', (req, res, next) => {
    console.log('getBidAuctions');
  });

  return Router;
};

export default auctionRouter;
