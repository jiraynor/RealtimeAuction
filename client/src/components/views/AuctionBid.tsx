import React, { useState, ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBidLog } from '../../actions/bid-log.action';
import { setAuction } from '../../actions/auction.action';

const AuctionBid = () => {
  const dispatch = useDispatch();
  const auction = useSelector((state: any) => state.auction);
  const member = useSelector((state: any) => state.cookie_member);
  const socket = useSelector((state: any) => state.auction.socket);
  const bid_logs = useSelector((state: any) => state.bid_log.bid_logs);

  const [bid_price, setBid_Price] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>('');

  socket.on('onBid_logsEvent', (data: any) => {
    const { status, message, bid_logs, auction_item } = data;
    if (status === 200) {
      dispatch(setBidLog({ bid_logs }));
      dispatch(setAuction({ auction_item }));
      setAlertMessage('');
    } else {
      setAlertMessage(message);
    }
  });

  const onBidPriceHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setBid_Price(parseInt(e.target.value));

  const onBidHandler = () => {
    socket.emit('bid', { bid_price });
  };

  const onImmediateHandler = () => {
    socket.emit('immediate');
  };

  return (
    <div className="col-5">
      <div className="m-1 p-4 card" style={{ height: '500px' }}>
        <div className="card-body" style={{ overflowX: 'hidden' }}>
          {bid_logs.map((bid: any) => (
            <div
              key={bid.log_num}
              className={bid.state ? 'alert alert-danger' : 'alert alert-info'}
            >
              {bid.bider.id} 님이{' '}
              <strong>{bid.bid_price.toLocaleString('ko-KR')}</strong> 원에
              {bid.state ? ' 낙찰되' : ' 입찰하'}셨습니다!
            </div>
          ))}
        </div>
        {auction.auction_item.auction_status &&
          !auction.auction_item.successful_bid_status &&
          member.id &&
          auction.auction_item.saler.id != member.id && (
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
                  <button
                    className="btn btn-danger"
                    onClick={onImmediateHandler}
                  >
                    즉시매입
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
      {alertMessage !== '' && (
        <div className="toast show ml-1">
          <div className="toast-header">
            <strong className="mr-auto text-danger">
              본인경매에는 입찰할 수 없습니다.
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionBid;
