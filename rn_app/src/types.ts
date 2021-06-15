import {AxiosError} from 'axios';

export type SnsList = 'instagram' | 'twitter' | 'youtube' | 'tiktok';

export type BasicAxiosError = AxiosError<
  {errorType: 'invalidError'; message: string} | {errorType: 'loginError'}
>;

export type PrivateZone = {
  id: number;
  address: string;
};
