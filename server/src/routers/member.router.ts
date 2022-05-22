import { Router, Request, Response, NextFunction } from 'express';

import * as bcrypt from 'bcryptjs';

import {
  authAccessToken,
  setAccessToken,
  setRefreshToken,
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
    if (existed) return res.status(422).json({});

    await MemberRepository.signUp(dto);

    return res.status(200).json({});
  } catch (e) {
    return res.status(422).json({});
  }
});

// checkId/:id : 아이디 중복 확인
router.get('/checkId/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const member: Member = await MemberRepository.findOneBy({ id });

  if (member) {
    // 존재하는 아이디
    return res.status(406).json({});
  } else {
    // 존재하지 않는 아이디
    return res.status(200).json({});
  }
});

// signIn : 로그인
router.post(
  '/signIn',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, password } = req.body;

    const member: Member = await MemberRepository.findOneBy({ id });

    // bcrypt.compare -> 암호화 되어 있는 비밀번호를 복호화 시켜 비켜 해주는 것 반환값 true, false

    if (!member) return res.status(406).json({});

    const isEqualPw = await bcrypt.compare(password, member.password);

    if (!isEqualPw) return res.status(406).json({});

    try {
      // 로그인 성공
      const accessToken = setAccessToken(id);
      const refreshToken = setRefreshToken();

      // DB에 Refresh 토큰 저장
      MemberRepository.setRefreshToken(member, refreshToken);

      return res.status(200).json({
        authToken: accessToken,
        refreshToken,
        id: member.id,
        name: member.name,
        balance: member.balance,
      });
    } catch (e) {
      return res.status(503).json({});
    }
  }
);

// get: 회원 정보 불러오기
router.get('/get', async (req: Request, res: Response) => {
  const id = authAccessToken(req.headers.authorization);

  // 빈 토큰
  if (id === '-1') return res.status(401).json({});
  // 기간 만료
  else if (id === '0') return res.status(401).json({});
  // 잘못된 토큰
  else if (id === '1') return res.status(401).json({});

  try {
    const member: Member = await MemberRepository.findOneBy({ id });

    member.password = '********';
    return res.status(200).json(member);
  } catch (e) {
    return res.status(503).send('데이터베이스 오류');
  }
});

// update: 회원 정보 수정하기
router.patch('/update', async (req: Request, res: Response) => {
  const dto = req.body;

  const id = authAccessToken(req.headers.authorization);

  // 빈 토큰
  if (id === '-1') return res.status(401).json({});
  // 기간 만료
  else if (id === '0') return res.status(401).json({});
  // 잘못된 토큰
  else if (id === '1') return res.status(401).json({});

  try {
    const member: Member = await MemberRepository.updateMember(dto);
    return res.status(200).json(member);
  } catch (e) {
    return res.status(503).send('데이터베이스 오류');
  }
});

// wirhdrawal: 출금하기
router.post('/withdrawal', async (req: Request, res: Response) => {
  const { amount } = req.body;

  if (amount < 0) return res.status(401).json({});

  const id = authAccessToken(req.headers.authorization);
  // 빈 토큰
  if (id === '-1') return res.status(401).json({});
  // 기간 만료
  else if (id === '0') return res.status(401).json({});
  // 잘못된 토큰
  else if (id === '1') return res.status(401).json({});

  try {
    const member: Member = await MemberRepository.findOneBy({ id });

    if (member.balance < amount) return res.status(412).json({});

    member.balance -= amount;
    await MemberRepository.save(member);

    return res.status(200).json({ balance: member.balance });
  } catch (e) {
    return res.status(503).json({});
  }
});

// deposit: 입금하기
router.post('/deposit', async (req: Request, res: Response) => {
  const { amount } = req.body;

  if (amount < 0) return res.status(401).send('잘못된 금액');

  const id = authAccessToken(req.headers.authorization);
  // 빈 토큰
  if (id === '-1') return res.status(401).json({});
  // 기간 만료
  else if (id === '0') return res.status(401).json({});
  // 잘못된 토큰
  else if (id === '1') return res.status(401).json({});

  try {
    const member: Member = await MemberRepository.findOneBy({ id });
    member.balance += amount;

    await MemberRepository.save(member);

    return res.status(200).json({ balance: member.balance });
  } catch (e) {
    return res.status(503).json({});
  }
});

// getBalance: 유저 잔액 가져오기
router.post('/getBalance', async (req: Request, res: Response) => {
  const id = authAccessToken(req.headers.authorization);
  // 빈 토큰
  if (id === '-1') return res.status(401).json({});
  // 기간 만료
  else if (id === '0') return res.status(401).json({});
  // 잘못된 토큰
  else if (id === '1') return res.status(401).json({});

  try {
    const member: Member = await MemberRepository.findOneBy({ id });

    return res.status(200).json({ balance: member.balance });
  } catch (e) {
    return res.status(503).json({});
  }
});

export default router;
