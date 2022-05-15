import { Sequelize } from 'sequelize';
import Member from './member';
import Auction_item from './auction_item';
import Item_img from './item_img';

const sequelize = new Sequelize('auction', 'root', '6546', {
  host: 'localhost',
  dialect: 'mysql',
});

const member = Member(sequelize);
const auction_item = Auction_item(sequelize);

member.hasMany(auction_item, {
  foreginKey: 'saler_id',
  allowNull: false,
  constraint: true,
});

console.log(Member(sequelize));

console.log(Item_img(sequelize));

export default sequelize;
