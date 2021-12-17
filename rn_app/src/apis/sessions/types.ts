import {AccountType} from '~/types';

export type LoginData = {
  user: {
    id: string;
    name: string;
    avatar: string | null;
    introduce: string | null;
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
    intro: boolean;
    tooltipOfUsersDisplayShowed: boolean;
    groupsApplicationEnabled: boolean;
    videoCallingEnabled?: boolean;
    descriptionOfVideoCallingSettingsShowed: boolean;
    descriptionOfNotGettingTalkRoomMessageShowed: boolean;
    descriptionOfMyDisplayShowed: boolean;
    accountType: AccountType;
  };
  posts: {
    id: number;
    text: string | null;
    url: string;
    createdAt: string;
    userId: string;
    sourceType: 'image' | 'video';
    width?: number;
    height?: number;
  }[];
  flashes: {
    id: number;
    source: string;
    createdAt: string;
    sourceType: 'image' | 'video';
    userId: string;
    viewed: {userId: string}[];
  }[];
  backGroundItem: {
    id: number;
    url: string;
    type: 'image' | 'video';
    width: number | null;
    height: number | null;
  };
};
