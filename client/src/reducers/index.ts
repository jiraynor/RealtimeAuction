import { combineReducers } from 'redux';
import member from './member.reducer';
import cookie_member from './cookie-member.reducer';
import balance from './balance.reducer';
import auction from './auction.reducer';
import auction_list from './auction-list.reducer';

export default combineReducers({
  member,
  cookie_member,
  balance,
  auction,
  auction_list,
});
