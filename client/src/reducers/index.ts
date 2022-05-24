import { combineReducers } from 'redux';
import member from './member.reducer';
import cookie_member from './cookie-member.reducer';
import balance from './balance.reducer';
import bid_log from './bid-log.reducer';
import auction from './auction.reducer';
import auction_list from './auction-list.reducer';
import auction_list_type from './auction-list-type.reducer';
import item_img from './item-img.action';
import token from './token.reducer';

export default combineReducers({
  member,
  cookie_member,
  balance,
  bid_log,
  auction,
  auction_list,
  auction_list_type,
  item_img,
  token,
});
