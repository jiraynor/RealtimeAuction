import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios, { AxiosResponse } from 'axios';
import cookies from 'react-cookies';
import { UpdateAuctionModal } from '../modals';
import { removeAuction, setAuction } from '../../actions/auction.action';
import { setAuctionList } from '../../actions/auction-list.action';
import { setAuctionListType } from '../../actions/auction-list-type.action';
import ImageModal from '../modals/Item-Image.modal';

const AuctionItem = () => {
  const dispatch = useDispatch();

  const auction = useSelector((state: any) => state.auction);
  const cookie_member = useSelector((state: any) => state.cookie_member);
  const item_imgs = useSelector((state: any) => state.item_img.item_imgs);

  console.log(item_imgs);
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const [imageShow, setImageShow] = useState<boolean>(false);

  const [alertMessage, setAlertMessage] = useState<string>('');

  const updateCloseHandler = () => setUpdateShow(false);
  const updateShowHandler = () => setUpdateShow(true);
  const imageCloseHandler = () => setImageShow(false);
  const imageShowHandler = () => setImageShow(true);

  const onDeleteHandelr = () => {
    const jwt = cookies.load('authToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    axios
      .delete(`/api/auction/delete/${auction.auction_item.auction_num}`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          dispatch(setAuctionList(response.data));
          dispatch(setAuctionListType('all'));
          dispatch(setAuction({ auction_item: { auction_num: 0 } }));
        }
      })
      .catch((e) => {
        console.log(e.message);
        if (e.response.status === 422) {
          setAlertMessage('등록에 실패했습니다.');
        }
      });
  };

  const onStartHandler = () => {
    const jwt = cookies.load('authToken');
    const body = {
      auction_num: auction.auction_item.auction_num,
    };
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    axios
      .patch(`/api/auction/start`, body)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          dispatch(setAuction(response.data));
        }
      })
      .catch((e) => {
        if (e.response.status === 422) {
          setAlertMessage('등록에 실패했습니다.');
        }
      });
  };

  return (
    <>
      {auction.auction_item.auction_num !== 0 ? (
        <div className="col-7">
          <div className="m-1 p-4 card" style={{ height: '500px' }}>
            <h3 className="mb-3">{auction.auction_item.item_name}</h3>
            <div className="row mb-3">
              <div className="col-3">물건번호</div>
              <div className="col-3">{auction.auction_item.auction_num}</div>
              <div className="col-3">판매자</div>
              <div className="col-3">{auction.auction_item.saler.id}</div>
            </div>
            <div className="row mb-3">
              <div className="col-3">물건종류</div>
              <div className="col-3">{auction.auction_item.item_category}</div>
              <div className="col-3">물건수량</div>
              <div className="col-3">
                {auction.auction_item.number_of_item.toLocaleString('ko-KR')} 개
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-3">시세</div>
              <div className="col-3">
                {auction.auction_item.appraisal_value.toLocaleString('ko-KR')}{' '}
                원
              </div>
              <div className="col-3">시작 가격</div>
              <div className="col-3">
                {auction.auction_item.lowest_selling_price.toLocaleString(
                  'ko-KR'
                )}{' '}
                원
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-3">즉시 매입 가격</div>
              <div className="col-3">
                {auction.auction_item.immediate_sale_price !== 0
                  ? auction.auction_item.immediate_sale_price.toLocaleString(
                      'ko-KR'
                    ) + ' 원'
                  : '없음'}
              </div>
              <div className="col-3">현재 금액</div>
              <div className="col-3">
                {auction.auction_item.current_price.toLocaleString('ko-KR')} 원
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-3">등록일</div>
              <div className="col-3">
                {auction.auction_item.reg_datetime.substring(0, 10)}
              </div>
              <div className="col-3">마감일</div>
              <div className="col-3">
                {auction.auction_item.deadline.substring(0, 10)}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-3">경매 여부</div>
              <div className="col-3">
                {auction.auction_item.auction_status ? (
                  <span className="badge badge-success">경매 중</span>
                ) : (
                  <span className="badge badge-danger">중지</span>
                )}
              </div>
              <div className="col-3">낙찰 여부</div>
              <div className="col-3">
                {auction.auction_item.successful_bid_status ? (
                  <span className="badge badge-primary">낙찰</span>
                ) : (
                  <span className="badge badge-warning">낙찰 전</span>
                )}
              </div>
            </div>
            <div className="row mt-2 mb-1">
              {item_imgs.length !== 0 && (
                <>
                  <div className="col-12">
                    <button
                      className="btn btn-outline-info btn-block"
                      onClick={imageShowHandler}
                    >
                      이미지 보기
                    </button>
                  </div>
                  <ImageModal show={imageShow} onHide={imageCloseHandler} />
                </>
              )}
            </div>
            {!auction.auction_item.auction_status &&
              !auction.auction_item.successful_bid_status &&
              auction.auction_item.saler.id === cookie_member.id && (
                <div className="row mb-3 mt-4">
                  <div className="col-4">
                    <button
                      className="btn btn-outline-danger btn-block"
                      onClick={onDeleteHandelr}
                    >
                      삭제
                    </button>
                  </div>
                  <div className="col-4">
                    <button
                      className="btn btn-outline-warning btn-block"
                      onClick={updateShowHandler}
                    >
                      수정
                    </button>
                  </div>
                  <div className="col-4">
                    <button
                      className="btn btn-outline-primary btn-block"
                      onClick={onStartHandler}
                    >
                      경매 시작
                    </button>
                  </div>
                  <UpdateAuctionModal
                    show={updateShow}
                    onHide={updateCloseHandler}
                  />
                </div>
              )}
            {auction.auction_item.successful_bid_status && (
              <>
                <div className="row mb-3">
                  <div className="col-3">낙찰자</div>
                  <div className="col-3">
                    {auction.auction_item.successful_bidder.id}
                  </div>
                  <div className="col-3">낙찰 가격</div>
                  <div className="col-3">
                    {auction.auction_item.successful_bid_price.toLocaleString(
                      'ko-KR'
                    )}{' '}
                    원
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-3">낙찰날짜</div>
                  <div className="col-3">
                    {auction.auction_item.successful_bid_datetime.substring(
                      0,
                      10
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AuctionItem;
