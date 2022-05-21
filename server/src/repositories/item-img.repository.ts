import AppDataSource from '../app-data-source';
import { Auction_item, Item_img } from '../entities';

export const ItemImgRepository = AppDataSource.getRepository(Item_img).extend({
  set(img: string, auction: Auction_item) {
    const auction_img = this.create({
      img,
      auction,
    });

    return this.save(auction_img);
  },
});
