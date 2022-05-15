import { NOW } from 'sequelize';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { now } from 'sequelize/types/utils';
import Member from './member';

const Item_img = (sequelize) => {
  const item_img = sequelize.define('Item_img', {
    //  이미지 번호
    img_num: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },

    // 이미지
    img: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // 물건 번호
    auction_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return item_img;
};

export default Item_img;
