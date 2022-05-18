import { Like } from 'typeorm';
import AppDataSource from '../app-data-source';
import { RegistDto, UpdateDto } from '../dtos/auction.dto';
import { Auction_item, Member } from '../entities';

export const AuctionRepository = AppDataSource.getRepository(
  Auction_item
).extend({
  regist(dto: RegistDto, member: Member) {
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

  async getPageList(page: number) {
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

  getPageLikeList(page: number, search: string) {
    const pageNum = (page - 1) * 10;
    return this.find({
      where: { item_name: Like(`%${search}%`) },
      skip: pageNum,
      take: 10,
      order: { auction_num: 'DESC' },
    });
  },

  update(dto: UpdateDto, saler: Member) {
    const {
      auction_num,
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
      auction_num,
      item_name,
      item_category,
      number_of_item,
      appraisal_value,
      lowest_selling_price,
      immediate_sale_price,
      item_note,
      deadline,
      saler,
    });

    this.save(auction);

    return this.findOneBy({ auction_num });
  },
});
