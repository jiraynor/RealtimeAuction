import { useState, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Modal, Alert } from 'react-bootstrap';

const RegistAuctionModal = (props: any) => {
  return (
    <Modal {...props} size="lg" centered>
      <Modal.Header>
        <Modal.Title>경매 등록</Modal.Title>
        <Modal.Body>
          <div className="mb-2 row">
            <div className="col-2 p-1">물건 이름</div>
            <div className="col-10 p-1">
              <input type="text" className="form-control" />
            </div>
          </div>
          <div className="mb-2 row">
            <div className="col-2 p-1">물건 종류</div>
            <div className="col-4 p-1">
              <select className="form-control">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div>
            <div className="col-2 p-1">물건 수량</div>
            <div className="col-4 p-1">
              <input type="number" className="form-control" />
            </div>
          </div>
          <div className="mb-2 row">
            <div className="col-2 p-1">감정 평가 금액</div>
            <div className="col-4 p-1">
              <input type="number" className="form-control" />
            </div>
            <div className="col-2 p-1">최저 매각 금액</div>
            <div className="col-4 p-1">
              <input type="number" className="form-control" />
            </div>
          </div>
          <div className="mb-2 row">
            <div className="col-2 p-1">즉시 매입 금액</div>
            <div className="col-4 p-1">
              <input type="number" className="form-control" />
            </div>
            <div className="col-2 p-1"></div>
            <div className="col-4 p-1"></div>
          </div>
          <div className="mb-2 row">
            <div className="p-1">설명</div>
          </div>
          <div className="mb-2 row">
            <div className="p-1">
              <textarea rows={5} minLength={5} />
            </div>
          </div>
          <div className="mb-2 row">
            <div className="col-2 p-1">시작 시간</div>
            <div className="col-4 p-1">
              <input type="datetime" className="form-control" />
            </div>
            <div className="col-2 p-1">종료 시간</div>
            <div className="col-4 p-1">
              <input type="datetime" className="form-control" />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-outline-danger">
            취소
          </button>
          <button type="button" className="btn btn-outline-success">
            등록
          </button>
        </Modal.Footer>
      </Modal.Header>
    </Modal>
  );
};

export default RegistAuctionModal;
