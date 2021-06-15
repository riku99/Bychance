import {ClientData} from '~/stores/types';

export type RejectPayload =
  | {errorType: 'loginError'}
  | {errorType: 'invalidError'; message: string}
  | {errorType: 'someError'};

export type SuccessfullLoginData = ClientData;
