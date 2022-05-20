import { DataSource } from 'typeorm';
import { Auction_item } from './entities/Auction_item.entity';
import { Bid_log } from './entities/Bid_log.entity';
import { Item_img } from './entities/Item_img.entity';
import { Member } from './entities/Member.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'developer',
  password: 'qwer1234',
  database: 'auction',
  entities: [Member, Auction_item, Item_img, Bid_log],
  synchronize: true,
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
