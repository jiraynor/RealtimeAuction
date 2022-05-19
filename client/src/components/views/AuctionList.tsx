import React, { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cookies from 'react-cookies';

import { RegistAuctionModal } from '../modals';
import axios, { AxiosResponse } from 'axios';
import { setAuction } from '../../actions/auction.action';
import { setAuctionList } from '../../actions/auction-list.action';
import { setAuctionListType } from '../../actions/auction-list-type.action';

const AuctionList = () => {
  const dispatch = useDispatch();

  const auction_list = useSelector((state: any) => state.auction_list);
  const auction_list_type = useSelector(
    (state: any) => state.auction_list_type
  );

  const [registShow, setRegistShow] = useState<boolean>(false);
  const [pageNum, setPageNum] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');

  const registCloseHandler = () => setRegistShow(false);

  const onSearchHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const getAuctionHandler = (auction_num: number) => {
    axios
      .get(`/api/auction/get/${auction_num}`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          setSearch('');
          dispatch(setAuction(response.data));
        } else {
          return;
        }
      });
  };

  const registShowHandler = () => {
    const jwt = cookies.load('authToken');
    if (!jwt) {
      setAlertMessage('로그인 후 이용하실 수 있습니다.');
      return;
    }
    setRegistShow(true);
  };

  const onAllAuctionsHandler = () => {
    axios
      .get(`/api/auction/getAuctions/${1}`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          setSearch('');
          dispatch(setAuctionList(response.data));
          dispatch(setAuctionListType('all'));
        } else {
          return;
        }
      });
  };

  const getAllList = (pageNum: number) => {
    axios
      .get(`/api/auction/getAuctions/${pageNum}`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          setSearch('');
          setPageNum(pageNum);
          dispatch(setAuctionList(response.data));
          dispatch(setAuctionListType('all'));
        } else {
          return;
        }
      });
  };

  const onMyAuctionsHandler = () => {
    const jwt = cookies.load('authToken');
    if (!jwt) {
      setAlertMessage('로그인 후 이용하실 수 있습니다.');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    axios
      .get(`/api/auction/getMyAuctions/${1}`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          setSearch('');
          dispatch(setAuctionList(response.data));
          dispatch(setAuctionListType('my'));
        } else {
          return;
        }
      });
  };

  const getMyList = (pageNum: number) => {
    const jwt = cookies.load('authToken');
    if (!jwt) {
      setAlertMessage('로그인 후 이용하실 수 있습니다.');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    axios
      .get(`/api/auction/getMyAuctions/${pageNum}`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          setSearch('');
          setPageNum(pageNum);
          dispatch(setAuctionList(response.data));
          dispatch(setAuctionListType('my'));
        } else {
          return;
        }
      });
  };

  const onBidAuctionsHandler = () => {
    const jwt = cookies.load('authToken');
    if (!jwt) {
      setAlertMessage('로그인 후 이용하실 수 있습니다.');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    axios
      .get(`/api/auction/getBidAuctions/${1}`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          setSearch('');
          dispatch(setAuctionList(response.data));
          dispatch(setAuctionListType('bid'));
        } else {
          return;
        }
      });
  };

  const getBidList = (pageNum: number) => {
    const jwt = cookies.load('authToken');
    if (!jwt) {
      setAlertMessage('로그인 후 이용하실 수 있습니다.');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    axios
      .get(`/api/auction/getBidAuctions/${pageNum}`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          setSearch('');
          dispatch(setAuctionList(response.data));
          dispatch(setAuctionListType('bid'));
        } else {
          return;
        }
      });
  };

  const getSearchList = (pageNum: number) => {
    axios
      .get(`/api/auction/getSearchAuctions/${pageNum}/${search}`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          setPageNum(pageNum);
          dispatch(setAuctionList(response.data));
          dispatch(setAuctionListType('my'));
        } else {
          return;
        }
      });
  };

  useEffect(() => onAllAuctionsHandler(), []);

  const pageChange = (pageNum: number) => {
    if (auction_list_type === 'all') getAllList(pageNum);
    else if (auction_list_type === 'my') getMyList(pageNum);
    else if (auction_list_type === 'bid') getBidList(pageNum);
    else if (auction_list_type === 'search') getSearchList(pageNum);
  };

  const page = () => {
    if (!auction_list.pagination) return;
    const { hasPrev, prev, min, hasNext, next, max } = auction_list.pagination;
    const items = [];

    if (hasPrev)
      items.push(
        <li className="page-item">
          <a className="page-link text-dark">
            <i className="bi bi-caret-left-fill"></i>
          </a>
        </li>
      );
    for (let p = min; p <= max; p++) {
      items.push(
        <li className="page-item">
          {p == pageNum ? (
            <a className="page-link text-dark active">{p}</a>
          ) : (
            <a className="page-link text-dark">{p}</a>
          )}
        </li>
      );
    }
    if (hasNext)
      items.push(
        <li className="page-item">
          <a className="page-link text-dark">
            <i className="bi bi-caret-right-fill"></i>
          </a>
        </li>
      );
    return items;
  };

  return (
    <div className="m-1">
      <div className="p-4 card">
        <h3 style={{ marginTop: '10px' }}>경매 목록</h3>
        <div className="input-group mb-3" style={{ marginTop: '35px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="품명 검색"
            onChange={onSearchHandler}
            value={search}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              onClick={() => getSearchList(1)}
            >
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
        <table className="table table-hover mb-3">
          <thead>
            <tr>
              <th>품명</th>
              <th className="text-center">경매자</th>
              <th className="text-center">현재가</th>
              <th className="text-center">즉시 매입가</th>
              <th className="text-center" style={{ width: '10%' }}>
                낙찰 여부
              </th>
            </tr>
          </thead>
          <tbody>
            {auction_list.auction_list &&
              auction_list.auction_list.map((auction: any) => (
                <tr
                  key={auction.auction_num}
                  onClick={() => getAuctionHandler(auction.auction_num)}
                >
                  <td>{auction.item_name}</td>
                  <td className="text-center">{auction.saler.id}</td>
                  <td className="text-center">
                    {auction.current_price.toLocaleString('ko-KR')} 원
                  </td>
                  <td className="text-center">
                    {auction.immediate_sale_price.toLocaleString('ko-KR')} 원
                  </td>
                  <td className="text-center">
                    {auction.successful_bid_satus && (
                      <span className="badge badge-danger">낙찰</span>
                    )}
                    {!auction.successful_bid_satus && (
                      <span className="badge badge-warning">낙찰 전</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <ul
          className="pagination justify-content-center"
          style={{ margin: '20px 0' }}
        >
          {page()}
        </ul>
        {alertMessage !== '' && (
          <div className="alert alert-info">
            <button
              type="button"
              className="close"
              onClick={() => setAlertMessage('')}
            >
              &times;
            </button>
            {alertMessage}
          </div>
        )}
        <div className="row" style={{ marginTop: '30px' }}>
          <div className="p-1 col-3">
            <button
              className="btn btn-outline-success btn-block"
              onClick={onAllAuctionsHandler}
            >
              전체 목록
            </button>
          </div>
          <div className="p-1 col-3">
            <button
              className="btn btn-outline-success btn-block"
              onClick={onMyAuctionsHandler}
            >
              내 경매 목록
            </button>
          </div>
          <div className="p-1 col-3">
            <button
              className="btn btn-outline-success btn-block"
              onClick={onBidAuctionsHandler}
            >
              내 입찰 경매 목록
            </button>
          </div>
          <div className="p-1 col-3">
            <button
              className="btn btn-outline-primary btn-block"
              onClick={registShowHandler}
            >
              경매 등록
            </button>
          </div>
        </div>
      </div>
      <RegistAuctionModal show={registShow} onHide={registCloseHandler} />
    </div>
  );
};

export default AuctionList;
