import { Router, Request, Response, NextFunction } from 'express';
import { DataSource, MaxKey } from 'typeorm';
import { Member } from '../entities/Member.entity';

import { auth } from '../utils/utility';

import * as cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { MemberRepository } from '../repositories/member.repository';

const router: Router = Router();

// signUp: 회원가입
router.post(
  '/signUp',
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = req.body;

    console.log('라우터 :', dto);
    dto.password = await bcrypt.hash(dto.password, 10);

    try {
      const member = await MemberRepository.signUp(dto);
      res.status(200).end('성공');
    } catch (e) {
      console.error(e.message);
      res.status(503).end('실패');
    }
  }
);

// checkId/:id : 아이디 중복 확인
router.get(
  '/checkId/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const member: Member = await MemberRepository.findOneBy({ id });

    if (member) {
      // 존재하는 아이디
      res.status(406).end('중복');
    } else {
      // 존재하지 않는 아이디
      res.status(200).end('중복 아님');
    }
  }
);

// signIn : 로그인
router.post(
  '/signIn',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, password } = req.body;

    const member: Member = await MemberRepository.findOneBy({ id });

    console.log(password);
    // bcrypt.compare -> 암호화 되어 있는 비밀번호를 복호화 시켜 비켜 해주는 것 반환값 true, false
    const isEqualPw = await bcrypt.compare(password, member.password);

    if (isEqualPw) {
      // 로그인 성공

      const jwtSecret = 'JsonWebTokenSecret';

      const newUserToken = jwt.sign({ id }, jwtSecret, {
        expiresIn: 60 * 60 * 1000 * 24,
      }); // 60초 * 15 = 15분

      res.status(200).json({
        authToken: newUserToken,
        id: member.id,
        name: member.name,
        balance: member.balance,
      });
    } else {
      // 로그인 실패
      res.status(406).end('실패');
    }
  }
);

// get: 회원 정보 불러오기
router.get('/get', async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  const token = authorization && authorization.split(' ')[1];

  const jwtSecret = 'JsonWebTokenSecret';

  const userToken = jwt.verify(token, jwtSecret);
  const id = userToken['id'];

  const member: Member = await MemberRepository.findOneBy({ id });

  member.password = '********';

  if (member) {
    res.status(200).json(member);
  } else {
    res.status(401).end('실패');
  }
});

// update: 회원 정보 수정하기
router.patch(
  '/update',
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = req.body;

    const id = auth(req.headers.authorization);
    if (!id) res.status(401).send('권한없음');

    try {
      console.log('라우터(mr) : ', dto);
      const member: Member = await MemberRepository.update(dto);

      member.password = '********';

      res.status(200).json(member);
    } catch (e) {
      console.error(e.message);
      res.status(503).end('실패');
    }
  }
);

// wirhdrawal: 출금하기
router.post(
  '/withdrawal',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, amount } = req.body;

    console.log(amount);
    const member: Member = await MemberRepository.findOneBy({ id });

    if (member && member.balance >= amount) {
      // 출금 성공
      member.balance -= amount;

      MemberRepository.save(member);

      console.log(member.balance);

      res.status(200);
      res.json({ balance: member.balance });
    } else {
      // 출금 실패
      res.status(422);
    }
  }
);

// getBalance: 유저 잔액 가져오기
router.post(
  '/getBalance',
  async (req: Request, res: Response, next: NextFunction) => {
    const id = auth(req.headers.authorization);

    if (!id) res.status(401).send('권한없음');

    const member: Member = await MemberRepository.findOneBy({ id });

    res.status(200).json({ balance: member.balance });
  }
);

export default router;
