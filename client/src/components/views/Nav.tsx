import React, { useEffect, useState, MouseEvent } from 'react';
import SignUpModal from '../modals/SignUpModal';
import SignInModal from '../modals/SignInModal';
import { useSelector, useDispatch } from 'react-redux';
import cookies from 'react-cookies';
import axios, { AxiosResponse } from 'axios';
import { setCookieMember } from '../../actions/cookie_member_action';

function Nav() {
  const dispatch = useDispatch();

  const [signUpShow, setSignUpShow] = useState<boolean>(false);
  const [signInShow, setSignInShow] = useState<boolean>(false);
  const [walletShow, setWalletShow] = useState<boolean>(false);
  const [memberShow, setMemberShow] = useState<boolean>(false);

  const signUpCloseHandler = () => setSignUpShow(false);
  const signUpShowHandler = () => setSignUpShow(true);
  const signInCloseHandler = () => setSignInShow(false);
  const signInShowHandler = () => setSignInShow(true);
  const walletCloseHandler = () => setWalletShow(false);
  const walletShowHandler = () => setWalletShow(true);
  const memberCloseHandler = () => setMemberShow(false);

  const memberShowHandler = () => {
    const jwt = cookies.load('authToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    axios.get(`/api/member/get`).then((response: AxiosResponse<any, any>) => {
      if (response.status === 200) {
        setMemberShow(true);
      } else {
        return;
      }
    });
  };

  const signOutHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axios
      .get(`/api/member/signOut`)
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
        } else {
          return;
        }
      });
  };

  const cookie_member = useSelector((state: any) => state.cookie_member);

  useEffect(() => {
    const cookie_member = cookies.load('member');
    console.log(cookie_member);
    if (cookie_member) {
      dispatch(setCookieMember(cookie_member));
    }
  }, [cookie_member]);

  return (
    <>
      {!cookie_member.id && (
        <div className="m-4">
          <div className="m-1 d-flex flex-row-reverse">
            <button
              className="m-1 p-2 btn btn-outline-primary"
              onClick={signInShowHandler}
            >
              <span className="m-4">로그인</span>
            </button>
            <button
              className="m-1 p-2 btn btn-outline-success"
              onClick={signUpShowHandler}
            >
              <span className="m-4">회원가입</span>
            </button>
          </div>
          <SignUpModal show={signUpShow} onHide={signUpCloseHandler} />
          <SignInModal show={signInShow} onHide={signInCloseHandler} />
        </div>
      )}

      {cookie_member.id && (
        <div className="m-4">
          <div className="row">
            <button
              className="p-2 btn btn-outline-danger col-sm-2"
              onClick={signOutHandler}
            >
              로그아웃
            </button>
            <div className="p-2 col-sm-8 text-center">
              <span
                style={{ cursor: 'pointer' }}
                className="font-weight-bold"
                onClick={memberShowHandler}
              >
                {cookie_member.name}
              </span>{' '}
              님의 잔액 <span className="font-weight-bold"></span>원
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
    </>
  );
}

export default Nav;
