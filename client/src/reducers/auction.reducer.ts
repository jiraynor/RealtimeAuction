import { SET_AUCTION, REMOVE_AUCTION } from '../actions/auction.action';

export default function reducer(state = {}, action: any) {
  const { type, value } = action;
  switch (type) {
    case SET_AUCTION: {
      return {
        ...state,
        ...value,
      };
    }
    case REMOVE_AUCTION: {
      return {
        ...state,
        ...value,
      };
    }
    default:
      return state;
  }
}
