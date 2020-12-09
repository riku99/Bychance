import {AxiosError} from 'axios';

export type rejectPayload =
  | {errorType: 'loginError'}
  | {errorType: 'invalidError'; message: string}
  | {errorType: 'someError'};

export type basicAxiosError = AxiosError<
  {errorType: 'invalidError'; message: string} | {errorType: 'loginError'}
>;
