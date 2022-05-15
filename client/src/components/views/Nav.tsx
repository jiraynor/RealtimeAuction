import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import cookies from 'react-cookies';
import SignUpModal from '../modals/SignUpModal';

const Nav = () => {
  const [member, setMember] = useState<String>('');
  const [status, setStatus] = useState<boolean>(false);
  const [registShow, setRegistShow] = useState<boolean>(false);

  const registCloseHandler = () => setRegistShow(false);
  const registShowHandler = () => setRegistShow(true);

  useEffect(() => {
    const jwt = cookies.load('authToken');
    if (jwt) setStatus(true);
  }, []);

  return (
    <>
      {!status && (
        <div className="m-4">
          <div className="m-1 d-flex flex-row-reverse">
            <Button className="m-1 p-2" variant="outline-primary">
              <span className="m-4">로그인</span>
            </Button>
            <Button
              className="m-1 p-2"
              variant="outline-success"
              onClick={registShowHandler}
            >
              <span className="m-4">회원가입</span>
            </Button>
          </div>
        </div>
      )}
      {status && (
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
      )}
      <SignUpModal
        show={registShow}
        onHide={registCloseHandler}
        setStatus={setStatus}
      />
    </>
  );
};

export default Nav;
