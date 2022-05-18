import React from 'react';

const AuctionBid = () => {
  return (
    <div className="col-4">
      <div
        className="m-1 p-4 card"
        style={{ height: '430px', overflowX: 'hidden' }}
      >
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
    </div>
  );
};

export default AuctionBid;
