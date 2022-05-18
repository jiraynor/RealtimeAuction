import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RegistAuctionModal } from '../modals';
import axios, { AxiosResponse } from 'axios';
import { setAuctionList } from '../../actions/auction-list.action';

const AuctionList = () => {
  const dispatch = useDispatch();

  const auction_list = useSelector((state: any) => state.auction_list);

  const [registShow, setRegistShow] = useState<boolean>(false);

  const registCloseHandler = () => setRegistShow(false);
  const registShowHandler = () => setRegistShow(true);

  useEffect(() => {
    axios
      .get(`/api/auction/getAuctions/${1}`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          dispatch(setAuctionList(response.data));
        } else {
          return;
        }
      });
  }, []);

  return (
    <div className="m-1">
      <div className="p-4 card">
        <h3 style={{ marginTop: '10px' }}>경매 목록</h3>
        <div className="input-group mb-3" style={{ marginTop: '35px' }}>
          <input type="text" className="form-control" placeholder="품명 검색" />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
        <table className="table table-hover mb-3">
          <thead>
            <tr>
              <th>품명</th>
              <th>경매자</th>
              <th>현재가</th>
              <th>즉시 매입가</th>
              <th>낙찰 여부</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>킥보드</td>
              <td>lacls159</td>
              <td>180,000</td>
              <td>200,000</td>
              <td>여</td>
            </tr>
            <tr>
              <td>킥보드</td>
              <td>lacls159</td>
              <td>180,000</td>
              <td>200,000</td>
              <td>여</td>
            </tr>
            <tr>
              <td>킥보드</td>
              <td>lacls159</td>
              <td>180,000</td>
              <td>200,000</td>
              <td>여</td>
            </tr>
          </tbody>
        </table>

        <ul
          className="pagination justify-content-center"
          style={{ margin: '20px 0' }}
        >
          <li className="page-item">
            <a className="page-link text-dark" href="javascript:void(0);">
              <i className="bi bi-caret-left-fill"></i>
            </a>
          </li>
          <li className="page-item">
            <a className="page-link text-dark" href="javascript:void(0);">
              1
            </a>
          </li>
          <li className="page-item">
            <a className="page-link text-dark" href="javascript:void(0);">
              2
            </a>
          </li>
          <li className="page-item">
            <a className="page-link text-dark" href="javascript:void(0);">
              3
            </a>
          </li>
          <li className="page-item">
            <a className="page-link text-dark" href="javascript:void(0);">
              4
            </a>
          </li>
          <li className="page-item">
            <a className="page-link text-dark" href="javascript:void(0);">
              5
            </a>
          </li>
          <li className="page-item">
            <a className="page-link text-dark" href="javascript:void(0);">
              <i className="bi bi-caret-right-fill"></i>
            </a>
          </li>
        </ul>
        <div className="row" style={{ marginTop: '50px' }}>
          <div className="p-1 col-3">
            <button className="btn btn-outline-success btn-block">
              전체 목록
            </button>
          </div>
          <div className="p-1 col-3">
            <button className="btn btn-outline-success btn-block">
              내 경매 목록
            </button>
          </div>
          <div className="p-1 col-3">
            <button className="btn btn-outline-success btn-block">
              경매 중 목록
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
