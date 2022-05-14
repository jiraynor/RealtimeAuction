import React from 'react';

const AuctionItem = () => {
  return (
    <div className="col-6">
      <div className="m-1 p-4 card" style={{ height: '430px' }}>
        <h3 className="mb-3">킥보드</h3>
        <div className="row mb-3">
          <div className="col-3">물건번호</div>
          <div className="col-3">1</div>
          <div className="col-3">판매자</div>
          <div className="col-3">lacls159</div>
        </div>
        <div className="row mb-3">
          <div className="col-3">물건종류</div>
          <div className="col-3">기타</div>
          <div className="col-3">물건수량</div>
          <div className="col-3">1</div>
        </div>
        <div className="row mb-3">
          <div className="col-3">시세</div>
          <div className="col-3">200,000원</div>
          <div className="col-3">시작 가격</div>
          <div className="col-3">50,000원</div>
        </div>
        <div className="row mb-3">
          <div className="col-3">즉시 매입 가격</div>
          <div className="col-3">200,000원</div>
        </div>
        <div className="row mb-3">
          <div className="col-3">등록일</div>
          <div className="col-3">2022-05-14</div>
          <div className="col-3">마감일</div>
          <div className="col-3">2022-05-21</div>
        </div>
        <div className="row mb-3">
          <div className="col-3">경매 시작 여부</div>
          <div className="col-3">종료</div>
          <div className="col-3">낙찰 여부</div>
          <div className="col-3">여</div>
        </div>
        <div className="row mb-3">
          <div className="col-3">낙찰자</div>
          <div className="col-3">gondor159</div>
          <div className="col-3">낙찰 가격</div>
          <div className="col-3">180,000원</div>
        </div>
        <div className="row mb-3">
          <div className="col-3">낙찰날짜</div>
          <div className="col-3">2022-05-21</div>
        </div>
      </div>
    </div>
  );
};

export default AuctionItem;
