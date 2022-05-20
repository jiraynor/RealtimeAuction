import { Router, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import { auth } from '../utils/utility';
import { MemberRepository } from '../repositories';
import { Member } from '../entities';

const router: Router = Router();

// signUp: 회원가입
router.post('/signUp', async (req: Request, res: Response) => {
  const dto = req.body;

  dto.password = await bcrypt.hash(dto.password, 10);

  try {
    const member = await MemberRepository.signUp(dto);

    console.log(dto.id);
    // findOneBy(dto.id);
    res.status(200).end('성공');
  } catch (e) {
    res.status(422).end('실패');
  }
});

// checkId/:id : 아이디 중복 확인
router.get('/checkId/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const member: Member = await MemberRepository.findOneBy({ id });

  if (member) {
    // 존재하는 아이디
    res.status(406).end('중복');
  } else {
    // 존재하지 않는 아이디
    res.status(200).end('중복 아님');
  }
});

// signIn : 로그인
router.post('/signIn', async (req: Request, res: Response) => {
  const { id, password } = req.body;

  const member: Member = await MemberRepository.findOneBy({ id });

  // bcrypt.compare -> 암호화 되어 있는 비밀번호를 복호화 시켜 비켜 해주는 것 반환값 true, false
  if (member) {
    const isEqualPw = await bcrypt.compare(password, member.password);

    if (!isEqualPw) res.status(406).send('잘못된 비밀번호');
  } else {
    res.status(406).send('아이디 없음');
  }

  try {
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
  } catch (e) {
    res.status(503).send('토큰 생성 오류');
  }
});

// get: 회원 정보 불러오기
router.get('/get', async (req: Request, res: Response) => {
  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  try {
    const member: Member = await MemberRepository.findOneBy({ id });

    member.password = '********';
    res.status(200).json(member);
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

// update: 회원 정보 수정하기
router.patch('/update', async (req: Request, res: Response) => {
  const dto = req.body;

  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  try {
    const member: Member = await MemberRepository.updateMember(dto);
    res.status(200).json(member);
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

// wirhdrawal: 출금하기
router.post('/withdrawal', async (req: Request, res: Response) => {
  const { amount } = req.body;

  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  try {
    const member: Member = await MemberRepository.findOneBy({ id });

    if (member.balance < amount) res.status(412).send('잔액 부족');

    member.balance -= amount;
    await MemberRepository.save(member);

    res.status(200).json({ balance: member.balance });
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

// deposit: 입금하기
router.post('/deposit', async (req: Request, res: Response) => {
  const { amount } = req.body;

  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  try {
    const member: Member = await MemberRepository.findOneBy({ id });
    member.balance += amount;

    await MemberRepository.save(member);

    res.status(200).json({ balance: member.balance });
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

// getBalance: 유저 잔액 가져오기
router.post('/getBalance', async (req: Request, res: Response) => {
  const id = auth(req.headers.authorization);
  if (!id) res.status(401).send('권한없음');

  try {
    const member: Member = await MemberRepository.findOneBy({ id });

    res.status(200).json({ balance: member.balance });
  } catch (e) {
    res.status(503).send('데이터베이스 오류');
  }
});

export default router;
