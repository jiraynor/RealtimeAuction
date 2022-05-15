import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';
import { Member } from '../entity/Member.entity';

dotenv.config();

const ormconfig: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'developer',
  password: 'qwer1234',
  database: 'auction',
  entities: [Member],
  synchronize: true,
  logging: true,
};

export default ormconfig;
