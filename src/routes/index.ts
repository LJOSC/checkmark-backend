import { Router } from 'express';
import { userRouter } from './user/user.routes';

const rootRouter = Router();

rootRouter.get('/health', (_, res) => {
  res.status(200).send('pong');
});

rootRouter.use('/user', userRouter);

export default rootRouter;
