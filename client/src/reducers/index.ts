import { combineReducers } from 'redux';
import member from './member_reducer';
import cookie_member from './cookie_member_reducer';

export default combineReducers({
  member,
  cookie_member,
});
