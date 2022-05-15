import { IRouter, Router } from 'express';
import { DataSource } from 'typeorm';

const bidRouter = (datasource: DataSource) => {
  const router: Router = Router();

  router.post('/set', (req, res, next) => {
    console.log('set');
  });

  router.post('/immediate', (req, res, next) => {
    console.log('immediate');
  });

  router.get('/getBids', (req, res, next) => {
    console.log('getBids');
  });

  return router;
};

export default bidRouter;
