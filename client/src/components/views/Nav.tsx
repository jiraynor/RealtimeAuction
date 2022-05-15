import React, { useEffect, useState, MouseEvent } from 'react';
import { Button } from 'react-bootstrap';
import cookies from 'react-cookies';
import axios, { AxiosResponse } from 'axios';
import SignInModal from '../modals/SignInModal';
import SignUpModal from '../modals/SignUpModal';
import WalletModal from '../modals/WalletModal';

type member = {
  id: string;
  name: string;
};

const Nav = () => {
  const [member, setMember] = useState<member>();
  const [balance, setBalance] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(false);
  const [signUpShow, setSignUpShow] = useState<boolean>(false);
  const [signInShow, setSignInShow] = useState<boolean>(false);
  const [walletShow, setWalletShow] = useState<boolean>(false);

  const signUpCloseHandler = () => setSignUpShow(false);
  const signUpShowHandler = () => setSignUpShow(true);
  const signInCloseHandler = () => setSignInShow(false);
  const signInShowHandler = () => setSignInShow(true);
  const walletCloseHandler = () => setWalletShow(false);
  const walletShowHandler = () => setWalletShow(true);

  const signOutHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axios
      .get(`/api/member/signOut`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          setMember(undefined);
          setStatus(false);
        } else {
          return;
        }
      });
  };

  const getBalance = () => {};

  useEffect(() => {
    const jwt = cookies.load('authToken');
    if (jwt) {
      const member = cookies.load('member');
      setMember(member);
      setStatus(true);
    }
  }, [status]);

  return (
    <>
      {!status && (
        <div className="m-4">
          <div className="m-1 d-flex flex-row-reverse">
            <Button
              className="m-1 p-2"
              variant="outline-primary"
              onClick={signInShowHandler}
            >
              <span className="m-4">로그인</span>
            </Button>
            <Button
              className="m-1 p-2"
              variant="outline-success"
              onClick={signUpShowHandler}
            >
              <span className="m-4">회원가입</span>
            </Button>
          </div>
        </div>
      )}
      {status && member && (
        <div className="m-4">
          <div className="row">
            <button
              className="p-2 btn btn-outline-danger col-sm-2"
              onClick={signOutHandler}
            >
              로그아웃
            </button>
            <div className="p-2 col-sm-8 text-center">
              <span className="font-weight-bold">{member.name}</span> 님의 잔액{' '}
              <span className="font-weight-bold">{balance}</span>원
            </div>
            <button
              className="p-2 btn btn-outline-info col-sm-2"
              onClick={walletShowHandler}
            >
              입 / 출금
            </button>
          </div>
        </div>
      )}
      <SignUpModal show={signUpShow} onHide={signUpCloseHandler} />
      <SignInModal
        show={signInShow}
        onHide={signInCloseHandler}
        setStatus={setStatus}
      />
      <WalletModal
        show={walletShow}
        balance={balance}
        setBalance={setBalance}
        onHide={walletCloseHandler}
      />
    </>
  );
};

export default Nav;
