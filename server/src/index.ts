import express, { Express } from 'express';
import { bidRouter, memberRouter, auctionRouter } from './routers';
import { parse } from 'cookie';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { setBid } from './middlewares/bid.middleware';
import { socketAuth } from './utils/utility';

const app: Express = express(),
  port: number = 4000,
  sPort: number = 4001;

app.use(express.json());
app.use(cookieParser());

app.use('/api/bid', bidRouter);
app.use('/api/auction', auctionRouter);
app.use('/api/member', memberRouter);

const server = app.listen(port, () => console.log(`port: ${port} start`));

const io = new Server(server, {
  path: '/api/bid',
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  console.log('==============================');
  // request 파라미터 받음
  const { auction_num } = socket.handshake.query;
  const { Bearer } = socket.handshake.auth;

  console.log('들어옴');
  console.log('auction_num :', auction_num);
  console.log('Bearer :', Bearer);
  console.log('room :', socket.rooms);

  if (Bearer === undefined) socket.disconnect(true);
  // auction_num 에 따른 room으로 이동

  const id = socketAuth(Bearer);

  socket.join(auction_num);

  socket.on('bid', async (data) => {
    const rooms = socket.rooms;
    console.log('---------------------------------------');
    console.log('bid - auction_num:', auction_num);
    console.log(rooms);
    console.log('---------------------------------------');

    // 입찰 처리
    // const { bid_price } = data;

    // const result = await setBid(parseInt(auction_num + ''), bid_price, id);
    // 리스트 반환
    // io.to(auction_num).emit('onBid_logsEvent', result);
    io.to(auction_num).emit('onBid_logsEvent', `${auction_num} 번 입찰됨`);
  });
});

io.listen(sPort);
