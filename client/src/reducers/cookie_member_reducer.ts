import { SET_COOKIE_MEMBER } from '../actions/cookie_member_action';

export default function reducer(state = {}, action: any) {
  const { type, value } = action;
  switch (type) {
    case SET_COOKIE_MEMBER: {
      return {
        ...state,
        ...value,
      };
    }
    default:
      return state;
  }
}
