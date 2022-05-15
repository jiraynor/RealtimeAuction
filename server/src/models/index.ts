import { Sequelize } from 'sequelize';
import Member from './member';

const sequelize = new Sequelize('auction', 'developer', 'qwer1234', {
  host: 'localhost',
  dialect: 'mysql',
});

console.log(Member(sequelize));

export default sequelize;
