import {UserBackGroundItem} from '~/types';

export type ResponseForGetUserPageInfo = {
  id: string;
  name: string;
  avatar: string | null;
  introduce: string | null;
  backGroundItem: UserBackGroundItem | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
  posts: {
    id: number;
    text: string | null;
    url: string;
    createdAt: string;
    userId: string;
    sourceType: 'image' | 'video';
    width: number | null;
    hright: number | null;
  }[];
  flashes: {
    id: number;
    source: string;
    sourceType: 'image' | 'video';
    userId: string;
    createdAt: string;
    viewed: {userId: string}[];
  }[];
  blockTo: boolean;
};

export type ResponseForGetRefreshMyData = {
  id: string;
  name: string;
  avatar: string | null;
  introduce: string | null;
  backGroundItem: UserBackGroundItem | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
  videoEditDescription: boolean;
  talkRoomMessageReceipt: boolean;
  showReceiveMessage: boolean;
  statusMessage: string | null;
  display: boolean;
  lat: number | null;
  lng: number | null;
  posts: {
    id: number;
    text: string | null;
    url: string;
    createdAt: string;
    userId: string;
    sourceType: 'image' | 'video';
  }[];
  flashes: {
    id: number;
    source: string;
    createdAt: string;
    sourceType: 'image' | 'video';
    userId: string;
    viewed: {userId: string}[];
  }[];
};

export type ResponseForPatchUsers = {
  id: string;
  name: string;
  avatar: string | null;
  introduce: string | null;
  statusMessage: string | null;
  backGroundItem: UserBackGroundItem | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
};
