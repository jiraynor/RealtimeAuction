import { SET_MEMBER } from '../actions/member_action';

export default function reducer(state = {}, action: any) {
  const { type, value } = action;
  switch (type) {
    case SET_MEMBER: {
      return {
        ...state,
        ...value,
      };
    }
    default:
      return state;
  }
}
