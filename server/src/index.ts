import express, { Express, Request, Response, NextFunction } from 'express';
import { auctionRouter, bidRouter, memberRouter } from './routers';
import { DataSource } from 'typeorm';
import AppDataSource from './app-data-source';
import cookieParser from 'cookie-parser';

// DB 연결
const datasource: DataSource = AppDataSource;

const app: Express = express(),
  port: number = 4000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auction', auctionRouter(datasource));
app.use('/api/bid', bidRouter(datasource));
app.use('/api/member', memberRouter(datasource));

app
  .get('/', (req, res) => res.json({ message: req['test'] }))
  .listen(port, () => console.log(`port: ${port} start`));
