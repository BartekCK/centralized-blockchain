export interface Success<T extends any> {
  outcome: 'SUCCESS';
  data: T;
}
