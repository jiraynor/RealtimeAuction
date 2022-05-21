import { io } from 'socket.io-client';
import cookies from 'react-cookies';
export const SET_AUCTION = 'SET_AUCTION';
export const REMOVE_AUCTION = 'REMOVE_AUCTION';
export const SET_SOCKET = 'SET_SOCKET';

export const setAuction = (auction: any) => ({
  type: SET_AUCTION,
  value: auction,
  // 여기 만든 부분
  socket: {
    socket: io('http://localhost:4001', {
      path: '/api/bid',
      query: {
        auction_num: auction.auction_item.auction_num,
      },
      auth: {
        Bearer: cookies.load('authToken'),
      },
      timeout: 1000,
    }),
  },
});

export const removeAuction = () => ({
  type: REMOVE_AUCTION,
  value: undefined,
  socket: undefined,
});

export const setSocket = (auction_num: number) => ({
  type: SET_SOCKET,
  // 여기 만든 부분
  socket: {
    socket: io('http://localhost:4001', {
      path: '/api/bid',
      query: {
        auction_num: auction_num,
      },
      auth: {
        Bearer: cookies.load('authToken'),
      },
      timeout: 1000,
    }),
  },
});
