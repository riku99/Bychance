import {AxiosError} from 'axios';

export type StampValues = 'thumbsUp' | 'yusyo' | 'yoi' | 'itibann' | 'seikai'; // 随時変更される可能性あり

export type SnsList = 'instagram' | 'twitter' | 'youtube' | 'tiktok';

export type Recommendation = {
  id: number;
  title: string;
  coupon: boolean;
  text: string;
  images: {
    url: string;
  }[];
  client: {
    url: string | null;
    name: string;
    image: string | null;
    instagram: string | null;
    twitter: string | null;
    address: string | null;
    lat: number | null;
    lng: number | null;
  };
};

export type RecieveTalkRoomMessageWithSocket = {
  message: {
    id: number;
    userId: string;
    roomId: number;
    text: string;
    createdAt: string;
  };
  sender: {
    id: string;
    name: string;
    avatar: string | null;
  };
  show: boolean;
};

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
