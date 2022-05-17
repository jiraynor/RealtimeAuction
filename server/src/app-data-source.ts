import { DataSource } from 'typeorm';
import { Auction_item } from './entity/Auction_item.entity';
import { Bid_log } from './entity/Bid_log.entity';
import { Item_img } from './entity/Item_img.entity';
import { Member } from './entity/Member.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '6546',
  database: 'auction',
  entities: [Member, Auction_item, Item_img, Bid_log],
  synchronize: false,
  logging: false,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
