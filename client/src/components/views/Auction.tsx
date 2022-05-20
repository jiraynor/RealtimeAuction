import React from 'react';
import { useSelector } from 'react-redux';
import AuctionBid from './AuctionBid';
import AuctionItem from './AuctionItem';

function Auction() {
  const auction = useSelector((state: any) => state.auction);
  return (
    <>
      {auction.auction_item && auction.auction_item.auction_num !== 0 && (
        <div className="p-1 row">
          <AuctionItem />
          <AuctionBid />
        </div>
      )}
    </>
  );
}

export default Auction;
