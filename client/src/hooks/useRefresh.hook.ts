import { useDispatch } from 'react-redux';
import cookies from 'react-cookies';

import axios, { AxiosResponse } from 'axios';

import { setToken } from '../actions/token.action';

const useRefresh = () => {
  const dispatch = useDispatch();

  const refresh = (callback: Function) => {
    const refreshToken = cookies.load('refreshToken');
    const { id } = cookies.load('member');
    axios.defaults.headers.common['Refresh-Token'] = refreshToken;
    axios
      .post(`/api/auth/refresh`, { id })
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          const { authToken, authExp, ...member } = response.data;
          dispatch(setToken({ authToken, refreshToken }));

          const authExpires = new Date();
          authExpires.setTime(authExpires.getTime() + authExp);
          cookies.save('authToken', authToken, {
            path: '/',
            secure: true,
            expires: authExpires,
          });
          cookies.save('member', member, {
            path: '/',
            expires: authExpires,
          });

          callback();
        }
      })
      .catch((e) => {
        window.alert('다시 로그인하세요.');
      });
  };
  return { refresh };
};

export default useRefresh;
