import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import cookies from 'react-cookies';
import { useDispatch } from 'react-redux';
import { setBalance } from '../actions/balance.action';
import { setCookieMember } from '../actions/cookie-member.action';
import { setToken } from '../actions/token.action';

export const useSignIn = () => {
  const dispatch = useDispatch();
  const [signInMessage, setSignInMessage] = useState<string>('');

  const signInMessageReset = () => setSignInMessage('');
  const signIn = (id: string, password: string, close: Function) => {
    if (id.length === 0 || password.length === 0) {
      setSignInMessage('모든 값을 입력해주세요.');
      return;
    }
    axios
      .post(`/api/member/signIn`, { id, password })
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          const {
            authToken,
            authExp,
            refreshToken,
            refreshExp,
            balance,
            ...member
          } = response.data;

          const authExpires = new Date();
          authExpires.setTime(authExpires.getTime() + authExp);
          const refreshExpires = new Date();
          refreshExpires.setTime(refreshExpires.getTime() + refreshExp);

          cookies.save('authToken', authToken, {
            path: '/',
            secure: true,
            expires: authExpires,
          });

          cookies.save('member', member, {
            path: '/',
            expires: authExpires,
          });

          cookies.save('refreshToken', refreshToken, {
            path: '/',
            expires: refreshExpires,
          });

          dispatch(setCookieMember(member));
          dispatch(setBalance({ balance: parseInt(balance) }));
          dispatch(setToken({ authToken, refreshToken }));

          close();
        }
      })
      .catch((e) => {
        const status = e.response.status;
        if (status === 401)
          setSignInMessage('로그인 정보가 일치하지 않습니다.');
        else if (status === 503) setSignInMessage('데이터베이스 오류입니다.');
      });
  };

  return { signInMessage, signInMessageReset, signIn };
};

export default useSignIn;
