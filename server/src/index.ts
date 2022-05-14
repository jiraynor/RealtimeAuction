import express from 'express';
import { auctionRouter, bidRouter, memberRouter } from './routers';

const app = express(),
  port = 4000;

app
  .get('/', (req, res) => res.json({ message: 'Hello' }))
  .listen(port, () => console.log(`port: ${port} start`));

// DB 연결

app.use('/api/auction', auctionRouter);
app.use('/api/bid', bidRouter);
app.use('/api/member', memberRouter);
