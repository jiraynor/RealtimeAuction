import { Router } from 'express';

const memberRouter: Router = Router();

// signUp: 회원가입
memberRouter.post('/signUp', async (req, res, next) => {
  // TODO: 회원가입 기능 만들기
  console.log('signUp');
});

memberRouter.post('/signIn', async (req, res, next) => {
  // TODO: 로그인 기능 만들기
  console.log('signUp');
});
memberRouter.get('/signOut', async (req, res, next) => {
  console.log('signOut');
});
memberRouter.get('/get', async (req, res, next) => {
  console.log('getMember');
});
memberRouter.patch('/update', async (req, res, next) => {
  console.log('memberUpdate');
});
memberRouter.post('/deposit', async (req, res, next) => {
  console.log('deposit');
});
memberRouter.post('/withdrawal', async (req, res, next) => {
  console.log('withdrawal');
});

export default memberRouter;
