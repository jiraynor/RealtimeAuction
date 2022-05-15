import express from 'express';
import { auctionRouter, bidRouter, memberRouter } from './routers';
import sequelize from './models';

const app = express(),
  port = 4000;

app
  .get('/', (req, res) => res.json({ message: 'Hello' }))
  .listen(port, () => console.log(`port: ${port} start`));

// DB 연결
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use('/api/auction', auctionRouter);
app.use('/api/bid', bidRouter);
app.use('/api/member', memberRouter);
