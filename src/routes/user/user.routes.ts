import express from 'express';
import { validate } from './user.validation';
import * as userController from './user.controller';
import { verifyRefreshToken } from 'src/middlewares/verifyRefreshToken';

const router = express.Router();

/* sign up */
router.post('/signup', validate('createUser'), userController.userSignupHandler);

/* login */
router.post('/login', validate('loginUser'), userController.userLoginHandler);

/* verify email */
router.get('/verify/:token', userController.verifyEmailHandler);

/* refresh access token*/
router.post('/refresh-access-token', verifyRefreshToken, userController.refreshAccessTokenHandler);

export { router as userRouter };
