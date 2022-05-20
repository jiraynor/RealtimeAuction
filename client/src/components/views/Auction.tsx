import React from 'react';
import { useSelector } from 'react-redux';
import AuctionBid from './AuctionBid';
import AuctionItem from './AuctionItem';

function Auction() {
  const auction = useSelector((state: any) => state.auction);
  return (
    <>
      {auction.auction_item && (
        <div className="p-1 row">
          <AuctionItem />
          <AuctionBid />
        </div>
      )}
    </>
  );
}

export default Auction;
