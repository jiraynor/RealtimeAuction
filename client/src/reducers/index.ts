import { combineReducers } from 'redux';
import member from './member.reducer';
import cookie_member from './cookie-member.reducer';
import balance from './balance.reducer';

export default combineReducers({
  member,
  cookie_member,
  balance,
});
