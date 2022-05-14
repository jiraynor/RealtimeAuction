import React from 'react';

const Nav = () => {
  return (
    <>
      <div className="m-4">
        <div className="m-1 d-flex flex-row-reverse">
          <button className="m-1 p-2 btn btn-outline-primary">
            <span className="m-4">로그인</span>
          </button>
          <button className="m-1 p-2 btn btn-outline-success">
            <span className="m-4">회원가입</span>
          </button>
        </div>
      </div>
      <div className="m-4">
        <div className="row">
          <button className="p-2 btn btn-outline-danger col-sm-2">
            로그아웃
          </button>
          <div className="p-2 col-sm-8 text-center">
            <span className="font-weight-bold">서지훈</span> 님의 잔액{' '}
            <span className="font-weight-bold">20,000,000</span>원
          </div>
          <button className="p-2 btn btn-outline-info col-sm-2">
            입 / 출금
          </button>
        </div>
      </div>
    </>
  );
};

export default Nav;
