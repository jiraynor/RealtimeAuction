import { Router, Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Member } from '../entity/Member.entity';

import * as cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

const memberRouter = (datasource: DataSource) => {
  const memberRepository = datasource.getRepository(Member);
  const router: Router = Router();

  // signUp: 회원가입
  router.post(
    '/signUp',
    async (req: Request, res: Response, next: NextFunction) => {
      const {
        id,
        password,
        name,
        address,
        tel,
        email,
        account_num,
        bank_code,
      } = req.body;

      const hashed = await bcrypt.hash(password, 10);

      const member = memberRepository.create({
        id,
        password: hashed,
        name,
        address,
        tel,
        email,
        account_num,
        bank_code,
      });

      try {
        if (member) {
          await memberRepository.save(member);
          res.status(200).end('성공');
        } else {
          res.status(422).end('실패');
        }
      } catch (e) {}
    }
  );

  router.get(
    '/checkId/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const member: Member = await memberRepository.findOneBy({ id });

      console.log(member);
      if (member) {
        // 존재하는 아이디
        res.status(406);
        res.end('중복');
      } else {
        // 존재하지 않는 아이디
        res.status(200);
        res.end('중복 아님');
      }
    }
  );

  // signIn : 로그인
  router.post(
    '/signIn',
    async (req: Request, res: Response, next: NextFunction) => {
      const { id, password } = req.body;

      const member: Member = await memberRepository.findOneBy({ id });

      console.log(password);
      // bcrypt.compare -> 암호화 되어 있는 비밀번호를 복호화 시켜 비켜 해주는 것 반환값 true, false
      const isEqualPw = await bcrypt.compare(password, member.password);
      console.log(isEqualPw);

      if (isEqualPw) {
        // 로그인 성공

        const jwtSecret = 'JsonWebTokenSecret';

        const newUserToken = jwt.sign({ id }, jwtSecret, {
          expiresIn: 60 * 15,
        }); // 60초 * 15 = 15분
        const userInfo = { id: member.id, name: member.name };

        console.log(newUserToken);
        console.log(userInfo);

        // res.writeHead(200, {Locaiton: '/', 'Set-Cookie': authToken=${??}; Expires=${60 * 15};  Path=/,});
        res.cookie('authToken', newUserToken, { maxAge: 60 * 60 * 1000 });
        res.cookie('member', userInfo, { maxAge: 60 * 60 * 1000 });
        res.status(200).send('성공');
      } else {
        // 로그인 실패
        res.status(406);
        res.end('실패');
      }
    }
  );
  // signOut: 로그아웃
  router.get(
    '/signOut',
    async (req: Request, res: Response, next: NextFunction) => {
      res.clearCookie('authToken');
      res.clearCookie('member');
      res.end('성공');

      console.log('signOut');
    }
  );

  // get: 회원 정보 불러오기
  router.get(
    '/get',
    async (req: Request, res: Response, next: NextFunction) => {
      const authorization = req.headers.authorization;
      const token = authorization && authorization.split(' ')[1];

      const jwtSecret = 'JsonWebTokenSecret';
      res.end('0');

      // if (token) {
      //   console.log(token);
      //   let auth = req.get('Authorization');
      //   const userToken = auth.split(' ')[1];
      //   jwt.verify(userToken, jwtSecret);
      //   console.log(auth);
      //   res.end('0');
      // } else {
      //   console.log(token);
      //   res.end('1');
      // }
    }
  );
  // update: 회원 정보 수정하기
  router.patch(
    '/update',
    async (req: Request, res: Response, next: NextFunction) => {
      console.log('memberUpdate');
    }
  );

  // deposit: 입금하기
  router.post(
    '/deposit',
    async (req: Request, res: Response, next: NextFunction) => {
      const { id, amount } = req.body;

      console.log(amount);
      const member: Member = await memberRepository.findOneBy({ id });

      if (member) {
        // 입금 성공
        member.balance += amount;

        memberRepository.save(member);

        console.log(member.balance);

        res.status(200);
        res.json({ balance: member.balance });
      } else {
        // 입금 실패
        res.status(422);
      }
    }
  );

  // wirhdrawal: 출금하기
  router.post(
    '/withdrawal',
    async (req: Request, res: Response, next: NextFunction) => {
      const { id, amount } = req.body;

      console.log(amount);
      const member: Member = await memberRepository.findOneBy({ id });

      if (member && member.balance >= amount) {
        // 출금 성공
        member.balance -= amount;

        memberRepository.save(member);

        console.log(member.balance);

        res.status(200);
        res.json({ balance: member.balance });
      } else {
        // 출금 실패
        res.status(422);
      }
    }
  );

  return router;
};

export default memberRouter;
