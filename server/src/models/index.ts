import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('auction', 'developer', 'qwer1234', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
