import { Failure, Success } from '../../interfaces';

export function isFailureAssert(
  result: Success<any> | Failure,
): asserts result is Failure {
  expect(result.outcome).toEqual('FAILURE');
}
