import { Router, Request, Response, NextFunction } from 'express';

import { MemberRepository } from '../repositories';
import { authRefreshToken, setAccessToken } from '../utils/utility';

const exp = 1000 * 60 * 60;

const router: Router = Router();

router.post('/refresh', async (req: Request, res: Response) => {
  const refreshToken = req.header('Refresh-Token');
  const { id } = req.body;

  const member = await MemberRepository.findOneBy({ id });

  // 존재하지 않는 회원
  if (!member) return res.status(400).json({});
  // 존재하지 않는 토큰
  if (refreshToken !== member.refreshToken) return res.status(400).json({});

  switch (authRefreshToken(refreshToken)) {
    case 0:
      return res
        .status(200)
        .json({ accessToken: setAccessToken(id), exp, member });
    case 1:
      // 검증 실패
      return res.status(400).json({});
    case -1:
      // 빈 값
      return res.status(400).json({});
  }
});

export default router;