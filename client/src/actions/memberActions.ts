import { Member } from '../types';
import { SIGN_IN, SIGN_OUT } from './types';

export const memberActions = {
  signIn: (member: Member) => ({ type: SIGN_IN, payload: member }),
  signOut: () => ({ type: SIGN_OUT, payload: { id: '', name: '' } }),
};

type SignInAction = ReturnType<typeof memberActions.signIn>;
type SignOutAction = ReturnType<typeof memberActions.signOut>;

export type MemberActionType = SignInAction | SignOutAction;
