import {
  SET_AUCTION,
  REMOVE_AUCTION,
  SET_SOCKET,
} from '../actions/auction.action';

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
      return {
        ...state,
        ...value,
        ...socket,
      };
    }
    case SET_SOCKET: {
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
