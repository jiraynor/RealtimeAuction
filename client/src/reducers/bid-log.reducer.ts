import { SET_BID_LOG, REMOVE_BID_LOG } from '../actions/bid-log.action';

export default function reducer(state = {}, action: any) {
  const { type, value } = action;
  switch (type) {
    case SET_BID_LOG: {
      return {
        ...state,
        ...value,
      };
    }
    case REMOVE_BID_LOG: {
      return {
        ...state,
        ...value,
      };
    }
    default:
      return state;
  }
}
