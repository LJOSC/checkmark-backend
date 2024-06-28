import { body } from 'express-validator';

type method = 'createUser' | 'loginUser';

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
    default:
      return [];
  }
};
