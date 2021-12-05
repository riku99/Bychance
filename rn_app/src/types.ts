export type StampValues = 'thumbsUp' | 'yusyo' | 'yoi' | 'itibann' | 'seikai'; // 随時変更される可能性あり

export type SnsList = 'instagram' | 'twitter' | 'youtube' | 'tiktok';

export type ApiError =
  | {errorType: 'invalidError'; message: string; alertDialog: boolean}
  | {errorType: 'loginError'}
  | {errorType: 'someError'};

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

export type UserBackGroundItem = {
  id: number;
  url: string;
  type: 'image' | 'video';
  width: number | null;
  height: number | null;
};

export type TalkRoomMessagesNotificationData = {
  type: 'talkRoomMessages';
  talkRoomId: string;
  partnerId: string;
};

export type VideoCallingNotificationData = {
  type: 'videoCalling';
  name: string;
};

export type PushNotificationData =
  | TalkRoomMessagesNotificationData
  | VideoCallingNotificationData;
