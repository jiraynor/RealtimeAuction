import { Router, Request, Response } from 'express';
import fs from 'fs';

import path from 'path';

const router: Router = Router();

router.get('/:filename', async (req: Request, res: Response) => {
  const { filename } = req.params;
  // 파일 존재하는지 확인
  if (
    !fs.existsSync(path.join(path.resolve('server/auction_images'), filename))
  )
    return res.status(400);

  return res.sendFile(
    path.join(path.resolve('server/auction_images'), filename)
  );
});

export default router;
