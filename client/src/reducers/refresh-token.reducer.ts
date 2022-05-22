import cookies from 'react-cookies';
import axios, { AxiosResponse } from 'axios';
export const getRefreshToken = (id: string) => {
  const refreshToken = cookies.load('refreshToken');
  if (!refreshToken) return '다시 로그인해주세요.';
  const headers = {
    'Refresh-Token': refreshToken,
  };
  if (id) {
    axios
      .post(`/api/auth/refresh`, { id }, { headers })
      .then((response: AxiosResponse<any, any>) => {
        if (response.status === 200) {
          const expires = new Date() + response.data.exp;
          expires.setHours(expires.getHours() + 1);
          cookies.save('authToken', response.data.accessToken, {
            path: '/',
            secure: true,
            expires,
          });
          cookies.save('member', response.data.member, {
            path: '/',
            expires,
          });
          return '회원 인증 정보가 갱신되었습니다. 다시 시도해 주세요.';
        }
      })
      .catch((e) => {
        return '다시 로그인해주세요.';
      });
  }
};
