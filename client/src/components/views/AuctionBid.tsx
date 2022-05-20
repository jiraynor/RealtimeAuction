import React, { useState, ChangeEvent, useEffect } from 'react';
import { io } from 'socket.io-client';
import cookies from 'react-cookies';
import { useDispatch, useSelector } from 'react-redux';
import { setBidLog } from '../../actions/bid-log.action';

const AuctionBid = () => {
  const dispatch = useDispatch();
  const auction = useSelector((state: any) => state.auction);
  const member = useSelector((state: any) => state.cookie_member);
  const socket = useSelector((state: any) => state.auction.socket);

  socket.on('onBid_logsEvent', (data: any) => {
    console.log(data);
  });

  const [bid_price, setBid_Price] = useState<number>(0);

  const onBidPriceHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setBid_Price(parseInt(e.target.value));

  const onBidHandler = () => {
    socket.emit('bid', { bid_price });
  };

  const onImmediateHandler = () => {
    //socket.emit('bid', { bid_price });
  };

  const sc = io('http://localhost:4001', {
    path: '/api/bid',
    query: {
      auction_num: auction.auction_item.auction_num,
    },
    auth: {
      Bearer: cookies.load('authToken'),
    },
    timeout: 1000,
  });

  return (
    <div className="col-5">
      <div className="m-1 p-4 card" style={{ height: '430px' }}>
        <div className="card-body" style={{ overflowX: 'hidden' }}>
          <div className="alert alert-info">
            lacls159 님이 <strong>100,000</strong> 원에 입찰하셨습니다!
          </div>
          <div className="alert alert-danger">
            lacls159 님이 <strong>100,000</strong> 원에 낙찰하셨습니다!
          </div>
        </div>
        {auction.auction_item.auction_status && (
          <div className="card-footer">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="금액"
                onChange={onBidPriceHandler}
              />
              <div className="input-group-append">
                <button className="btn btn-primary" onClick={onBidHandler}>
                  입찰
                </button>
                <button className="btn btn-danger" type="button">
                  즉시매입
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionBid;
