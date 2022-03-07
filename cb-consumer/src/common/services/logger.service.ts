import { LoggerServiceInterface } from './logger.service.interface';
import * as logLibrary from 'log4js';

export class LoggerService implements LoggerServiceInterface {
  private readonly logger;

  constructor(context?: string) {
    this.logger = logLibrary.getLogger(context);
    this.logger.level = 'debug';
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }

  fatal(message: string): void {
    this.logger.fatal(message);
  }

  info(message: string): void {
    this.logger.info(message);
  }

  trace(message: string): void {
    this.logger.trace(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }
}
