//@ts-nocheck
import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/HttpException';

import Joi from 'joi';
import env from 'src/configs/envVars';

/**
 * Error Handler Sends Stack Trace only during Development Environments
 *
 * @public
 *
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
export const ErrorHandler = (err: any, req: Request, res: Response) => {
  const response = {
    code: err.status || 500,
    message: err.message,
    errors: err.errors,
    stack: err.stack,
  };
  if (env === 'production') delete response.stack;
  res.status(response.code).json(response);
  res.end();
};

/**
 * Convert Error Thrown By Joi OR not an Instance of HttpException
 *
 * @public
 *
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 *
 * @returns {ErrorHandler} - forward converted error to error handler
 */
export const ConvertError = (err: any, req: Request, res: Response, next: NextFunction) => {
  let convertedError = err;
  if (err instanceof Joi.ValidationError) {
    const errors: any = [];
    err.details.map(({ message, context: { key } }) => errors.push({ key, message: message.replace(/[^\w\s]/gi, '') }));
    convertedError = new HttpException({
      message: 'Validation Error',
      status: err.status || 400,
      errors,
    });
  } else if (!(err instanceof HttpException)) {
    convertedError = new HttpException({
      message: err.message || 'Internal server error',
      status: err.status || 500,
      stack: err.stack,
    });
  }
  return ErrorHandler(convertedError, req, res, next);
};

/**
 * Catch 404 and forward to error handler
 *
 * @public
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 *
 * @returns {ErrorHandler} - forward error to error handler
 */
export const NotFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new HttpException({
    message: 'Resource you are looking for Not Found',
    status: 404,
  });
  return ErrorHandler(err, req, res, next);
};

/**
 * Catch 429 Rate limit exceeds
 *
 * @public
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 *
 * @returns {ErrorHandler} - forward error to error handler
 */
export const RateLimitHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new HttpException({
    message: 'Too many requests, please try again later after 1 hour.',
    status: 429,
  });
  return ErrorHandler(err, req, res, next);
};
