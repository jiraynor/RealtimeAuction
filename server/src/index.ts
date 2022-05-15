import express, { Express } from 'express';
import { auctionRouter, bidRouter, memberRouter } from './routers';
import { DataSource } from 'typeorm';
import AppDataSource from './app-data-source';

// DB 연결
const datasource: DataSource = AppDataSource;

const app: Express = express(),
  port: number = 4000;

app.use('/api/auction', auctionRouter(datasource));
app.use('/api/bid', bidRouter(datasource));
app.use('/api/member', memberRouter);

app
  .get('/', (req, res) => res.json({ message: 'Hello' }))
  .listen(port, () => console.log(`port: ${port} start`));
