import { SET_AUCTION_LIST_TYPE } from '../actions/auction-list-type.action';
const initState = {
  value: { type: 'all' },
};

export default function reducer(state = initState, action: any) {
  const { type, value } = action;
  switch (type) {
    case SET_AUCTION_LIST_TYPE: {
      console.log(value);
      return {
        ...state,
        ...value,
      };
    }
    default:
      return state;
  }
}
