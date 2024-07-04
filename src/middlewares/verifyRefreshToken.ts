import APIError from '../utils/APIError';
import { NextFunction, Request, Response } from 'express';
import { checkTokenInBlackList, getUserById } from 'src/routes/user/user.dao';
import env from 'src/configs/envVars';
import jwt from 'jsonwebtoken';
import { Ijwt } from 'src/types/auth';

const InvalidTokenError = () =>
  new APIError({
    message: 'Invalid Token',
    status: 401,
  });

export const decodeRefreshToken = async (token: string): Promise<Ijwt> => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET) as Ijwt;
  } catch (error) {
    throw InvalidTokenError();
  }
};

/**
 * @param {req} req - Requests
 * @param {res} _ - Response
 * @param {next} next - next
 * Header Authentication
 */
export const verifyRefreshToken = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const props = req.headers;

    const tokenNotPresent = !props.authorization;
    if (tokenNotPresent) {
      throw new APIError({
        message: 'Authorization not provided!',
        status: 401,
      });
    }

    const authHeader = props.authorization as string;

    const tokenType = authHeader.split(' ')[0];
    const tokenValue = authHeader.split(' ')[1];

    if (tokenType !== 'Bearer') {
      throw InvalidTokenError();
    }

    const { id } = await decodeRefreshToken(tokenValue);

    if (!id) {
      throw InvalidTokenError();
    }

    const isInvalidToken = await checkTokenInBlackList(tokenValue);

    if (isInvalidToken) {
      throw InvalidTokenError();
    }

    const user = await getUserById(id);

    if (!user) {
      throw InvalidTokenError();
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
