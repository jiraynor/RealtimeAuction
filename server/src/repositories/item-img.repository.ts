import AppDataSource from '../app-data-source';
import { Auction_item, Item_img } from '../entities';

export const ItemImgRepository = AppDataSource.getRepository(Item_img).extend({
  set(img: string, auction_item: Auction_item) {
    const auction_img = this.create({
      img,
      auction_item,
    });

    return this.save(auction_img);
  },
  getImgs(auction_item: Auction_item) {
    return this.findBy({ auction_item });
  },
});
