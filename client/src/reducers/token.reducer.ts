import { SET_TOKEN } from '../actions/token.action';

const initState = {
  value: { authToken: '', refreshToken: '' },
};

export default function reducer(state = initState, action: any) {
  const { type, value } = action;
  switch (type) {
    case SET_TOKEN: {
      return {
        ...state,
        ...value,
      };
    }
    default:
      return state;
  }
}
