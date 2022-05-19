import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

const AuctionBid = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io('http://localhost:4001', {
      path: '/api/bid',
      query: {
        auction_num: 1,
      },
    });
  }, []);

  const auction = useSelector((state: any) => state.auction);
  return (
    <>
      {auction.auction_item && (
        <div className="col-5">
          <div className="m-1 p-4 card" style={{ height: '430px' }}>
            <div className="card-body" style={{ overflowX: 'hidden' }}>
              <div className="alert alert-info">
                lacls159 님이 <strong>100,000</strong> 원에 입찰하셨습니다!
              </div>
              <div className="alert alert-info">
                lacls159 님이 <strong>100,000</strong> 원에 입찰하셨습니다!
              </div>
              <div className="alert alert-info">
                lacls159 님이 <strong>100,000</strong> 원에 입찰하셨습니다!
              </div>
              <div className="alert alert-info">
                lacls159 님이 <strong>100,000</strong> 원에 입찰하셨습니다!
              </div>
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
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="button">
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
      )}
    </>
  );
};

export default AuctionBid;
