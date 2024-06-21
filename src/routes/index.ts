import { Router } from 'express';

const rootRouter = Router();

rootRouter.get('/health', (_, res) => {
  res.status(200).send('pong');
});

export default rootRouter;
