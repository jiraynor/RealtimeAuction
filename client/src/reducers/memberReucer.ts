import { Member, MemeberState } from '../types';
import { MemberActionType } from '../actions/memberActions';
import { SIGN_IN, SIGN_OUT } from '../actions/types';

const initialState: MemeberState = {
  status: 'member',
  value: { id: '', name: '' },
};

export default (
  state: MemeberState = initialState,
  action: MemberActionType
) => {
  const { type, payload } = action;
  switch (type) {
    case SIGN_IN:
      return {
        ...state,
        value: payload,
      };
    case SIGN_OUT:
      return {
        ...state,
        value: payload,
      };
    default:
      return state;
  }
};
