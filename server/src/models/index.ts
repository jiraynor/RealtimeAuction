import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('auction', 'root', '6546', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
