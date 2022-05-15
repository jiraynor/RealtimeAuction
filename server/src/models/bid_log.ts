import { NOW } from 'sequelize';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { now } from 'sequelize/types/utils';
import Member from './member';

const Bid_log = (sequelize) => {
  const bid_log = sequelize.define('Bid_log', {
    //  로그 번호
    log_num: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },

    // 물건 번호
    auction_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // 입찰자 아이디
    bidder_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // 입찰 금액
    bid_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // 입찰 일시
    bid_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultVale: NOW,
    },
  });
  return bid_log;
};

export default Bid_log;
