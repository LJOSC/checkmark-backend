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
router.get('/verify/:token', validate('verifyEmail'), userController.verifyEmailHandler);

/* logout */
router.post('/logout', validate('logout'), userController.userLogoutHandler);

/* refresh access token*/
router.post('/refresh-access-token', verifyRefreshToken, userController.refreshAccessTokenHandler);

/* forgot password */
router.post('/forgot-password', validate('forgotPassword'), userController.forgotPasswordHandler);

/* reset password */
router.post('/reset-password', validate('resetPassword'), userController.resetPasswordHandler);

export { router as userRouter };
