import { LoggerServiceInterface } from '../logger.service.interface';

export class LoggerServiceMock implements LoggerServiceInterface {
  debug = jest.fn();
  error = jest.fn();
  fatal = jest.fn();
  info = jest.fn();
  trace = jest.fn();
  warn = jest.fn();
}
