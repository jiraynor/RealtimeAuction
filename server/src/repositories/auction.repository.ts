import { DataSource, Repository } from 'typeorm';
import AppDataSource from '../app-data-source';
import { registDto } from '../dtos/auction.dto';
import { Auction_item } from '../entities/Auction_item.entity';
import { Member } from '../entities/Member.entity';

export const AuctionRepository = AppDataSource.getRepository(
  Auction_item
).extend({
  regist(dto: registDto, member: Member) {
    const {
      item_name,
      item_category,
      number_of_item,
      appraisal_value,
      lowest_selling_price,
      immediate_sale_price,
      item_note,
      deadline,
    } = dto;

    const auction = this.create({
      item_name,
      item_category,
      number_of_item,
      appraisal_value,
      lowest_selling_price,
      immediate_sale_price,
      item_note,
      deadline,
      saler: member,
    });

    return this.save(auction);
  },

  getPageList(page: number) {
    const pageNum = (page - 1) * 10;
    return this.find({
      skip: pageNum,
      take: 10,
      order: { auction_num: 'DESC' },
    });
  },

  getPageSalerList(page: number, saler: Member) {
    const pageNum = (page - 1) * 10;
    return this.find({
      where: { saler },
      skip: pageNum,
      take: 10,
      order: { auction_num: 'DESC' },
    });
  },
});
