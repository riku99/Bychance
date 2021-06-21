import {AxiosError} from 'axios';

export type SnsList = 'instagram' | 'twitter' | 'youtube' | 'tiktok';

// サーバーから返ってくるエラーオブジェクト
export type BasicAxiosError = AxiosError<
  {errorType: 'invalidError'; message: string} | {errorType: 'loginError'}
>;

// API通信でエラー返ってきた際にエラーハンドリングして最終的にそのAPI用関数がリターンするデータ
export type ReturnApiError =
  | {errorType: 'loginError'}
  | {errorType: 'invalidError'}
  | {errorType: 'someError'};

export type PrivateZone = {
  id: number;
  address: string;
};

export type PrivateTime = {
  id: number;
  startHours: number;
  startMinutes: number;
  endHours: number;
  endMinutes: number;
};
