import { Router } from 'express';

const bidRouter: Router = Router();

bidRouter.post('/set', (req, res, next) => {
  console.log('set');
});

bidRouter.post('/immediate', (req, res, next) => {
  console.log('immediate');
});

bidRouter.get('/getBids', (req, res, next) => {
  console.log('getBids');
});

export default bidRouter;
