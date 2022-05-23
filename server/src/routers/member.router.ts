import { Router, Request, Response, NextFunction } from 'express';

import * as bcrypt from 'bcryptjs';

import {
  authAccessToken,
  setAccessToken,
  setRefreshToken,
  accessExp,
  refreshExp,
} from '../utils/utility';
import { MemberRepository } from '../repositories';
import { Member } from '../entities';
import { _AUTH_, _REFRESH_ } from '../utils/utility';

const router: Router = Router();

// signUp: 회원가입
router.post('/signUp', async (req: Request, res: Response) => {
  const dto = req.body;

  dto.password = await bcrypt.hash(dto.password, 10);

  try {
    const existed = await MemberRepository.findOneBy({ id: dto.id });
    // 존재하는 아이디
    if (existed)
      return res.status(422).json({ state: false, message: 'Existed ID' });

    await MemberRepository.signUp(dto);

    // 사용가능한 아이디
    return res
      .status(200)
      .json({ state: true, message: 'Successfully registered as a member' });
  } catch (e) {
    // 데이터베이스 오류
    return res.status(503).json({ state: false, message: 'Database Error' });
  }
});

// checkId/:id : 아이디 중복 확인
router.get('/checkId/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const member: Member = await MemberRepository.findOneBy({ id });

  if (member) {
    // 존재하는 아이디
    return res.status(205).json({ state: false, message: 'Existed ID' });
  } else {
    // 존재하지 않는 아이디
    return res.status(200).json({ state: true, message: 'Available ID' });
  }
});

// signIn : 로그인
router.post(
  '/signIn',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, password } = req.body;

    const member: Member = await MemberRepository.findOneBy({ id });

    // bcrypt.compare -> 암호화 되어 있는 비밀번호를 복호화 시켜 비켜 해주는 것 반환값 true, false

    // 아이디 불일치
    if (!member)
      return res
        .status(401)
        .json({ state: false, message: 'Sign in information does not match.' });

    const isEqualPw = await bcrypt.compare(password, member.password);

    // 비밀번호 불일치
    if (!isEqualPw)
      return res
        .status(401)
        .json({ state: false, message: 'Sign in information does not match.' });

    try {
      // 로그인 성공
      const accessToken = setAccessToken(id);
      const refreshToken = setRefreshToken();

      // DB에 Refresh 토큰 저장
      MemberRepository.setRefreshToken(member, refreshToken);

      return res.status(200).json({
        // 결과 상태
        state: true,
        // authToken
        authToken: accessToken,
        // authToken 만료기간
        authExp: accessExp,
        // refreshToken
        refreshToken,
        // refreshToken 만료기간
        refreshExp,
        // 회원 아이디
        id: member.id,
        // 회원 이름
        name: member.name,
        // 회원 잔액
        balance: member.balance,
      });
    } catch (e) {
      // 데이터베이스 오류
      return res.status(503).json({ state: false, message: 'Database Error' });
    }
  }
);

// get: 회원 정보 불러오기
router.get('/get', async (req: Request, res: Response) => {
  const id = authAccessToken(req.headers.authorization);

  // 빈 토큰
  if (id === '-1')
    return res.status(496).json({ state: false, message: 'Empty Token.' });
  // 기간 만료
  else if (id === '0')
    return res.status(402).json({ state: false, message: 'Expired Token.' });
  // 잘못된 토큰
  else if (id === '1')
    return res.status(495).json({ state: false, message: 'Invalid Token.' });

  try {
    const member: Member = await MemberRepository.findOneBy({ id });

    member.password = '********';
    return res.status(200).json(member);
  } catch (e) {
    // 데이터베이스 오류
    return res.status(503).json({ state: false, message: 'Database Error' });
  }
});

// update: 회원 정보 수정하기
router.patch('/update', async (req: Request, res: Response) => {
  const dto = req.body;

  const id = authAccessToken(req.headers.authorization);

  // 빈 토큰
  if (id === '-1')
    return res.status(496).json({ state: false, message: 'Empty Token.' });
  // 기간 만료
  else if (id === '0')
    return res.status(402).json({ state: false, message: 'Expired Token.' });
  // 잘못된 토큰
  else if (id === '1')
    return res.status(495).json({ state: false, message: 'Invalid Token.' });

  try {
    const member: Member = await MemberRepository.updateMember(dto);
    return res.status(200).json(member);
  } catch (e) {
    // 데이터베이스 오류
    return res.status(503).json({ state: false, message: 'Database Error' });
  }
});

// wirhdrawal: 출금하기
router.post('/withdrawal', async (req: Request, res: Response) => {
  const { amount } = req.body;

  if (amount < 0)
    return res.status(400).json({ state: false, message: 'Invalid request.' });

  const id = authAccessToken(req.headers.authorization);
  // 빈 토큰
  if (id === '-1')
    return res.status(496).json({ state: false, message: 'Empty Token.' });
  // 기간 만료
  else if (id === '0')
    return res.status(402).json({ state: false, message: 'Expired Token.' });
  // 잘못된 토큰
  else if (id === '1')
    return res.status(495).json({ state: false, message: 'Invalid Token.' });

  try {
    const member: Member = await MemberRepository.findOneBy({ id });

    if (member.balance < amount)
      return res
        .status(400)
        .json({ state: false, message: 'A Shortage of Balance.' });

    member.balance -= amount;
    await MemberRepository.save(member);

    return res.status(200).json({ balance: member.balance });
  } catch (e) {
    // 데이터베이스 오류
    return res.status(503).json({ state: false, message: 'Database Error' });
  }
});

// deposit: 입금하기
router.post('/deposit', async (req: Request, res: Response) => {
  const { amount } = req.body;

  if (amount < 0) return res.status(401).json({});

  const id = authAccessToken(req.headers.authorization);
  // 빈 토큰
  if (id === '-1')
    return res.status(496).json({ state: false, message: 'Empty Token.' });
  // 기간 만료
  else if (id === '0')
    return res.status(402).json({ state: false, message: 'Expired Token.' });
  // 잘못된 토큰
  else if (id === '1')
    return res.status(495).json({ state: false, message: 'Invalid Token.' });

  try {
    const member: Member = await MemberRepository.findOneBy({ id });
    member.balance += amount;

    await MemberRepository.save(member);

    return res.status(200).json({ balance: member.balance });
  } catch (e) {
    // 데이터베이스 오류
    return res.status(503).json({ state: false, message: 'Database Error' });
  }
});

// getBalance: 유저 잔액 가져오기
router.post('/getBalance', async (req: Request, res: Response) => {
  const id = authAccessToken(req.headers.authorization);
  // 빈 토큰
  if (id === '-1')
    return res.status(496).json({ state: false, message: 'Empty Token.' });
  // 기간 만료
  else if (id === '0')
    return res.status(402).json({ state: false, message: 'Expired Token.' });
  // 잘못된 토큰
  else if (id === '1')
    return res.status(495).json({ state: false, message: 'Invalid Token.' });

  try {
    const member: Member = await MemberRepository.findOneBy({ id });

    return res.status(200).json({ balance: member.balance });
  } catch (e) {
    // 데이터베이스 오류
    return res.status(503).json({ state: false, message: 'Database Error' });
  }
});

export default router;
