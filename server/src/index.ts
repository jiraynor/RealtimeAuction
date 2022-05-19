import express, { Express } from 'express';
import { bidRouter, memberRouter, auctionRouter } from './routers';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';

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
  // request 파라미터 받음
  const param = socket.handshake.query;
  console.log(param.auction_num);
});

io.listen(sPort);
