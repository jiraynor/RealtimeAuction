import { SET_BALANCE } from '../actions/balance.action';

export default function reducer(state = {}, action: any) {
  const { type, value } = action;
  switch (type) {
    case SET_BALANCE: {
      return {
        ...state,
        ...value,
      };
    }
    default:
      return state;
  }
}
