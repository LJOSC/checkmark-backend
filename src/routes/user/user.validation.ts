import { body, param, query } from 'express-validator';

type method =
  | 'createUser'
  | 'loginUser'
  | 'verifyEmail'
  | 'logout'
  | 'forgotPassword'
  | 'resetPassword'
  | 'authTokenChecker';

export const validate = (method: method) => {
  switch (method) {
    case 'createUser':
      {
        return [
          body('email').isEmail().withMessage('Email is required'),
          body('username')
            .exists()
            .withMessage('Username is required')
            .isLength({ min: 5 })
            .withMessage('Username must be at least 5 characters'),
          body('password').isLength({ min: 8 }).withMessage('Password is required'),
          body('firstName').exists().withMessage('First name is required'),
          body('lastName').optional().isString().withMessage('Last name must be a string'),
        ];
      }
      break;
    case 'loginUser':
      {
        return [
          body('email').isEmail().withMessage('Email is required'),
          body('password').isString().withMessage('Password is required'),
        ];
      }
      break;
    case 'verifyEmail':
      {
        return [
          param('token').isString().withMessage('Token is required'),
          query('email').isEmail().withMessage('Email is required'),
        ];
      }
      break;
    // case 'logout':
    //   {
    //     return [body('refreshToken').isString().withMessage('Refresh token is required')];
    //   }
    //   break;
    case 'forgotPassword':
      {
        return [body('email').isEmail().withMessage('Email is required')];
      }
      break;
    case 'resetPassword':
      {
        return [
          body('email').isEmail().withMessage('Email is required'),
          body('password').isString().withMessage('Password is required'),
          body('otp').isString().withMessage('otp is required'),
        ];
      }
      break;
    case 'authTokenChecker':
      {
        return [body('refreshToken').isString().withMessage('Refresh token is required')];
      }
      break;
    default:
      return [];
  }
};
