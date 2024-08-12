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
 * Body Authentication
 */
export const verifyRefreshToken = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;

    const { id } = await decodeRefreshToken(refreshToken);

    if (!id) {
      throw InvalidTokenError();
    }

    const isInvalidToken = await checkTokenInBlackList(refreshToken);

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
