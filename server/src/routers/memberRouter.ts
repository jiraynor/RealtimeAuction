import { Router } from 'express';
import { DataSource } from 'typeorm';

const memberRouter = (datasource: DataSource) => {
  const router: Router = Router();

  // signUp: 회원가입
  router.post('/signUp', async (req, res, next) => {
    // TODO: 회원가입 기능 만들기
    console.log('signUp');
  });

  router.post('/signIn', async (req, res, next) => {
    // TODO: 로그인 기능 만들기
    console.log('signUp');
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
