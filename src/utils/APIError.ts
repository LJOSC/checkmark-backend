//@ts-nocheck
import httpsStats from './http-status';

export default class APIError extends Error {
  /**
   *
   * @param {param} param0
   */
  constructor({
    message = 'Internal server error occured',
    stack,
    errors,
    status = httpsStats.INTERNAL_SERVER_ERROR,
  }: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.stack = stack;
  }
}
