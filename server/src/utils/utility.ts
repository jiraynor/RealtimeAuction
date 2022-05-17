import jwt from 'jsonwebtoken';
export const auth = (authorization: string) => {
  const token = authorization && authorization.split(' ')[1];
  const jwtSecret = 'JsonWebTokenSecret';
  const userToken = jwt.verify(token, jwtSecret);
  return userToken['id'];
};
