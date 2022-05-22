import jwt from 'jsonwebtoken';

export const _AUTH_ = 'rtas"auth';
export const _REFRESH_ = 'rtas"refresh';

// accessToken 생성
export const setAccessToken = (id: string) =>
  jwt.sign({ id }, _AUTH_, {
    expiresIn: '1d',
  });

// refreshToken 생성
export const setRefreshToken = () =>
  jwt.sign({}, _REFRESH_, {
    expiresIn: '30 days',
  });

// accessToken 검증
// return - 검증 성공 : 아이디, 빈 authToken : -1, 만료 : 0, 잘못된 토큰 : 1
export const authAccessToken = (authToken: string) => {
  try {
    if (authToken) {
      const token = authToken.split(' ')[1];
      const accessToken = jwt.verify(token, _AUTH_);

      return accessToken['id'];
    }
    return '-1';
  } catch (e) {
    if (e.message === 'jwt expired') {
      return '0';
    } else {
      return '1';
    }
  }
};

// refreshToken 검증
// return - 검증 성공 : 0, 빈 refreshToken : -1, 만료 혹은 잘못된 토큰 : 1
export const authRefreshToken = (refreshToken: string) => {
  try {
    if (refreshToken) {
      jwt.verify(refreshToken, _REFRESH_);
      return 0;
    }
    return -1;
  } catch (e) {
    return 1;
  }
};

export const socketAuth = (token: string) => {
  try {
    if (token) {
      const userToken = jwt.verify(token, _AUTH_);
      return userToken['id'];
    }
    return '-1';
  } catch (e) {
    if (e.message === 'jwt expired') {
      return '0';
    } else {
      return '1';
    }
  }
};
