import { useEffect, useState, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cookies from 'react-cookies';

import axios, { AxiosResponse } from 'axios';

import { SignUpModal, SignInModal, WalletModal, MemberModal } from '../modals';

import { setCookieMember } from '../../actions/cookie-member.action';
import { setBalance } from '../../actions/balance.action';
import { useGetBalance, useGetMember } from '../../hooks';

function Nav() {
  const dispatch = useDispatch();

  const cookie_member = useSelector((state: any) => state.cookie_member);
  const balance = useSelector((state: any) => state.balance);
  const socket = useSelector((state: any) => state.auction.socket);

  const { memberShow, memberShowReset, getMember } = useGetMember();
  const { getBalance } = useGetBalance();

  const [signUpShow, setSignUpShow] = useState<boolean>(false);
  const [signInShow, setSignInShow] = useState<boolean>(false);
  const [walletShow, setWalletShow] = useState<boolean>(false);

  const signUpCloseHandler = () => setSignUpShow(false);
  const signUpShowHandler = () => setSignUpShow(true);
  const signInCloseHandler = () => setSignInShow(false);
  const signInShowHandler = () => setSignInShow(true);
  const walletCloseHandler = () => setWalletShow(false);
  const walletShowHandler = () => setWalletShow(true);
  const memberCloseHandler = () => memberShowReset();

  const memberShowHandler = () => getMember();

  const signOutHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (socket) socket.disconnect();
    dispatch(setCookieMember({ id: '', name: '' }));
    dispatch(setBalance({ balance: 0 }));
    cookies.save('authToken', '', {
      expires: new Date(),
    });
    cookies.save('member', '', {
      expires: new Date(),
    });
  };
  useEffect(() => {
    getBalance();
  }, []);

  return (
    <>
      {!cookie_member.id && (
        <div className="m-4">
          <div className="m-1 d-flex flex-row-reverse">
            <button
              className="m-1 p-2 btn btn-outline-primary"
              onClick={signInShowHandler}
            >
              <span className="m-4">?????????</span>
            </button>
            <button
              className="m-1 p-2 btn btn-outline-success"
              onClick={signUpShowHandler}
            >
              <span className="m-4">????????????</span>
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
              ????????????
            </button>
            <div className="p-2 col-sm-8 text-center">
              <span
                style={{ cursor: 'pointer' }}
                className="font-weight-bold"
                onClick={memberShowHandler}
              >
                {cookie_member.name}
              </span>{' '}
              ?????? ??????{' '}
              <span className="font-weight-bold">{balance.balance}</span>???
            </div>
            <button
              className="p-2 btn btn-outline-info col-sm-2"
              onClick={walletShowHandler}
            >
              ??? / ??????
            </button>
          </div>
          <WalletModal show={walletShow} onHide={walletCloseHandler} />
          <MemberModal show={memberShow} onHide={memberCloseHandler} />
        </div>
      )}
    </>
  );
}

export default Nav;
