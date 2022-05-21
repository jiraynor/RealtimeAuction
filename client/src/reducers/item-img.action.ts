import { SET_ITEM_IMG } from '../actions/item-img.action';

export default function reducer(state = {}, action: any) {
  const { type, value } = action;
  switch (type) {
    case SET_ITEM_IMG: {
      return {
        ...state,
        ...value,
      };
    }
    default:
      return state;
  }
}
