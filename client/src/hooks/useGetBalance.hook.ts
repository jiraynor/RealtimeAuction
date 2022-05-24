import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cookies from 'react-cookies';

import axios, { AxiosResponse } from 'axios';
import { setCookieMember } from '../actions/cookie-member.action';
import { setBalance } from '../actions/balance.action';
import useRefresh from './useRefresh.hook';

const useGetBalance = () => {
  const dispatch = useDispatch();
  const { refresh } = useRefresh();

  const getBalance = () => {
    const cookie_member = cookies.load('member');

    if (cookie_member) {
      dispatch(setCookieMember(cookie_member));
      const { id } = cookie_member;

      const jwt = cookies.load('authToken');
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
      axios
        .post(`/api/member/getBalance`, { id })
        .then((response: AxiosResponse<any, any>) => {
          if (response.status === 200) {
            const { balance } = response.data;
            dispatch(setBalance({ balance }));
          }
        })
        .catch((e) => {
          if (e.response.status === 402) {
            refresh(getBalance);
          } else if (e.response.status === 495 || e.response.status === 496)
            window.alert('다시 로그인 해주세요.');
          else if (e.response.status === 503)
            window.alert('데이터베이스 오류가 발생했습니다.');
        });
    }
  };

  return { getBalance };
};

export default useGetBalance;
