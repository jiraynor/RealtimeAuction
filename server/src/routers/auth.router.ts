import { Router, Request, Response, NextFunction } from 'express';

import { MemberRepository } from '../repositories';
import { authRefreshToken, setAccessToken } from '../utils/utility';

import { accessExp } from '../utils/utility';

const router: Router = Router();

router.post('/refresh', async (req: Request, res: Response) => {
  const refreshToken = req.header('Refresh-Token');
  const { id } = req.body;

  const member = await MemberRepository.findOneBy({ id });

  console.log('id :', id);
  console.log('member :', member);
  // 존재하지 않는 회원
  if (!member)
    return res
      .status(422)
      .json({ state: false, message: 'A Non-Existent Member.' });
  // 존재하지 않는 토큰
  console.log('refreshToken :', refreshToken);
  console.log('member.refreshToken :', member.refreshToken);
  if (refreshToken !== member.refreshToken)
    return res.status(495).json({ state: false, message: 'Non Exist Token.' });

  switch (authRefreshToken(refreshToken)) {
    case 0:
      return res.status(200).json({
        authToken: setAccessToken(id),
        authExp: accessExp,
        id: member.id,
        name: member.name,
      });
    case 1:
      // 검증 실패
      return res
        .status(495)
        .json({ state: false, message: 'Verification failed.' });
    case -1:
      // 빈 값
      return res.status(496).json({ state: false, message: 'Empty Token.' });
  }
});

export default router;
