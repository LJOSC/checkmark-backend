//@ts-nocheck

class HttpException extends Error {
  constructor({ message, stack, errors, status }) {
    super();
    this.message = message;
    this.errors = errors;
    this.status = status || 500;
    this.stack = stack;
  }
}

/**
 * @description Create HttpException
 */
export default HttpException;
