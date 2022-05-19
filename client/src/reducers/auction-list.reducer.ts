import { SET_AUCTION_LIST } from '../actions/auction-list.action';

export default function reducer(state = {}, action: any) {
  const { type, value } = action;
  switch (type) {
    case SET_AUCTION_LIST: {
      console.log('리듀서 :', value);
      return {
        ...state,
        ...value,
      };
    }
    default:
      return state;
  }
}
