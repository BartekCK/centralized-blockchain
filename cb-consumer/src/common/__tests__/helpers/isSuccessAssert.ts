import { Failure, Success } from '../../interfaces';

export function isSuccessAssert<T>(
  result: Success<T> | Failure,
): asserts result is Success<T> {
  expect(result.outcome).toEqual('SUCCESS');
}
