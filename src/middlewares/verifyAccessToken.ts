import APIError from '../utils/APIError';
import { NextFunction, Request, Response } from 'express';
import { getUserById } from 'src/routes/user/user.dao';
import env from 'src/configs/envVars';

var jwt = require('jsonwebtoken');

const InvalidTokenError = () =>
  new APIError({
    message: 'Invalid Token',
    status: 401,
  });

export const decodeAccessToken = async (token: string) => {
  try {
    return await jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);
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
export const verifyAccessToken = async (req: Request, _: Response, next: NextFunction) => {
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

    const { id } = await decodeAccessToken(tokenValue);

    if (!id) {
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
