import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Member } from '../entity/Member.entity';

const memberRouter = (datasource: DataSource) => {
  const memberRepository = datasource.getRepository(Member);
  const router: Router = Router();

  // signUp: 회원가입
  router.post('/signUp', async (req, res, next) => {
    const { id, password, name, address, tel, email, account_num, bank_code } =
      req.body;

    const member = memberRepository.create({
      id,
      password,
      name,
      address,
      tel,
      email,
      account_num,
      bank_code,
    });

    try {
      await memberRepository.save(member);
    } catch (e) {}
  });

  router.get('/checkId/:id', async (req, res, next) => {
    const { id } = req.params;

    const member: Member = await memberRepository.findOneBy({ id });

    if (member) {
      // 존재하는 아이디
    } else {
      // 존재하지 않는 아이디
    }
  });

  router.post('/signIn', async (req, res, next) => {
    const { id, password } = req.body;

    const member = memberRepository.findOneBy({ id, password });

    if (member) {
      // 로그인 처리
    } else {
      // 로그인 실패
    }
  });
  router.get('/signOut', async (req, res, next) => {
    console.log('signOut');
  });
  router.get('/get', async (req, res, next) => {
    console.log('getMember');
  });
  router.patch('/update', async (req, res, next) => {
    console.log('memberUpdate');
  });
  router.post('/deposit', async (req, res, next) => {
    console.log('deposit');
  });
  router.post('/withdrawal', async (req, res, next) => {
    console.log('withdrawal');
  });

  return router;
};

export default memberRouter;
