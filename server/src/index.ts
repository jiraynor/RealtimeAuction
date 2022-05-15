import express from 'express';
import { auctionRouter, bidRouter, memberRouter } from './routers';
import AppDataSource from './app-data-source';

const app = express(),
  port = 4000;

// DB 연결
AppDataSource;

app.use('/api/auction', auctionRouter);
app.use('/api/bid', bidRouter);
app.use('/api/member', memberRouter);

app
  .get('/', (req, res) => res.json({ message: 'Hello' }))
  .listen(port, () => console.log(`port: ${port} start`));
