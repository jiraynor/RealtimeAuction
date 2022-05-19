import { SET_AUCTION_LIST_TYPE } from '../actions/auction-list-type.action';

export default function reducer(state = {}, action: any) {
  const { type, value } = action;
  switch (type) {
    case SET_AUCTION_LIST_TYPE: {
      return {
        ...state,
        ...value,
      };
    }
    default:
      return state;
  }
}
