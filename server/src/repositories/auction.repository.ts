import { Like, In, FindOptionsWhere } from 'typeorm';
import AppDataSource from '../app-data-source';
import { RegistDto, UpdateDto } from '../dtos/auction.dto';
import { Auction_item, Member } from '../entities';
import { BidRepository } from './bid.repository';

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
      deadline: deadline + ' 09:00:00',
      saler: member,
    });

    return this.insert(auction);
  },

  getPageList(page: number) {
    const pageNum = (page - 1) * 10;

    console.log(pageNum);

    return this.find({
      skip: pageNum,
      take: 10,
      order: { auction_num: 'DESC' },
    });
  },

  getPageSalerListCount(saler) {
    return this.count({ where: { saler } });
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

  getPageLikeListCount(search: string) {
    return this.count({ where: { item_name: Like(`%${search}%`) } });
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

  async getPageBidListCount(bider) {
    const bid_logs = await BidRepository.find(bider);
    const auction_nums: number[] = [];

    for (let bid_log of bid_logs)
      auction_nums.push(bid_log.auction.auction_num);

    return this.count({ where: { auction_num: In(auction_nums) } });
  },

  async getPageBidList(page: number, bider) {
    const pageNum = (page - 1) * 10;

    const bid_logs = await BidRepository.find(bider);
    const auction_nums: number[] = [];

    for (let bid_log of bid_logs)
      auction_nums.push(bid_log.auction.auction_num);

    return this.find({
      where: { auction_num: In(auction_nums) },
      skip: pageNum,
      take: 10,
      order: { auction_num: 'DESC' },
    });
  },

  updateAuction(dto: UpdateDto, saler: Member) {
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
      deadline: deadline + ' 09:00:00',
      saler,
    });

    return this.save(auction);
  },

  startAuction(auction: Auction_item) {
    auction.auction_status = true;

    return this.save(auction);
  },

  async updateCurrentPrice(auction: Auction_item, bid_price: number) {
    auction.current_price = bid_price;

    return this.save(auction);
  },

  async updateAuctionSuccessful(auction: Auction_item, bider: Member) {
    auction.auction_status = false;
    auction.current_price = auction.immediate_sale_price;
    auction.successful_bid_status = true;
    auction.successful_bidder = bider;
    auction.successful_bid_price = auction.immediate_sale_price;

    auction.successful_bid_datetime = new Date().toISOString();

    return this.save(auction);
  },
});
