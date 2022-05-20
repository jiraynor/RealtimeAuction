import { io } from 'socket.io-client';

import { SET_AUCTION, REMOVE_AUCTION } from '../actions/auction.action';

const initState = {
  value: undefined,
  // 여기 만든 부분
  socket: undefined,
};

export default function reducer(state = initState, action: any) {
  const { type, value, socket } = action;
  switch (type) {
    case SET_AUCTION: {
      return {
        ...state,
        ...value,
        ...socket,
      };
    }
    case REMOVE_AUCTION: {
      socket.socket.disconnect();
      return {
        ...state,
        ...value,
        ...socket,
      };
    }
    default:
      return state;
  }
}
