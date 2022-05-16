import { combineReducers } from 'redux';
import member from './memberReucer';
import { MemeberState } from '../types';

export default combineReducers({
  member,
});

export type ReducerState = {
  member: MemeberState;
};
