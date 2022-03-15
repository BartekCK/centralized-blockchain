import { Success } from '../../interfaces';

export const createSuccessMock = <T>(data: T): Success<T> => {
  return {
    outcome: 'SUCCESS',
    data,
  };
};
