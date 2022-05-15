import { NOW } from 'sequelize';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { now } from 'sequelize/types/utils';
import Member from './member';

const Auction_item = (sequelize) => {
  const auction_item = sequelize.define('Auction_item', {
    // 물건 번호
    auction_num: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },

    // 물건 이름
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // 물건 종류
    item_category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // 물건 수량
    number_of_item: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // 감정 평가액
    appraisal_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // 최저 매각 가격
    lowest_selling_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // 즉시 매입 가격
    immediate_sale_price: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },

    // 물건 비고
    item_note: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // 경매 시작 여부
    auction_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // 등록일
    reg_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW,
    },

    // 마감일
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    // 판매자 아이디
    saler_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // 낙찰 여부
    successful_bid_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // 낙찰자 아이디
    successful_bidder_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    // 낙찰 가격
    successful_bid_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },

    // 낙찰일
    successful_bid_datetime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  });
  return auction_item;
};

export default Auction_item;
