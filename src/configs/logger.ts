import logger from '../utils/logger';
import type { Logger as WinstonLogger } from 'winston';

class Logger {
  label: string;
  constructor(label: string) {
    this.label = label;
  }

  log(message: string): void {
    (logger as WinstonLogger).info(message, { label: this.label });
  }

  error(message: string): void {
    (logger as WinstonLogger).error(message, { label: this.label });
  }

  debug(message: string): void {
    (logger as WinstonLogger).debug(message, { label: this.label });
  }

  warn(message: string): void {
    (logger as WinstonLogger).warn(message, { label: this.label });
  }
}

export default Logger;
