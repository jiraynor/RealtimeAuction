import AppDataSource from '../app-data-source';
import { MemberRepository } from '../repositories';
import { Member } from '../entities';
import jwt from 'jsonwebtoken';

export const auth = (authorization: string) => {
  try {
    const token = authorization && authorization.split(' ')[1];
    const jwtSecret = 'JsonWebTokenSecret';
    const accessToken = jwt.verify(token, jwtSecret);
    authorization;

    return accessToken['id'];
  } catch (e) {
    console.error(e.message);
    return '';
  }
};

export const refreshToken = (id: string, refreshToken1: string) => {
  try {
    const token = MemberRepository.getRefreshToken(id, refreshToken1);
    const jwtSecret = 'JsonWebTokenSecret';
    const refreshToken = jwt.verify(token, jwtSecret);

    return refreshToken;
  } catch (e) {
    console.error(e.message);
    return '';
  }
};

export const socketAuth = (token: string) => {
  try {
    const jwtSecret = 'JsonWebTokenSecret';
    const userToken = jwt.verify(token, jwtSecret);
    return userToken['id'];
  } catch (e) {
    console.error(e.message);
    return '';
  }
};
