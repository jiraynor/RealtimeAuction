import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';
import { Auction_item } from '../entities/Auction_item.entity';
import { Bid_log } from '../entities/Bid_log.entity';
import { Item_img } from '../entities/Item_img.entity';
import { Member } from '../entities/Member.entity';

dotenv.config();

const ormconfig: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '6546',
  database: 'auction',
  entities: [Member, Auction_item, Item_img, Bid_log],
  synchronize: true,
  logging: true,
};

export default ormconfig;
