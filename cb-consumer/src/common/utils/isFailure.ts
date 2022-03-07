import { Success } from '../interfaces/success';
import { Failure } from '../interfaces/failure';

export const isFailure = <T>(
  result: Success<T> | Failure,
): result is Failure => {
  return result.outcome === 'FAILURE';
};
