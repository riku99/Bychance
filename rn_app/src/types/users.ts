export type User = {
  id: string;
  name: string;
  avatar: string | null;
  introduce: string;
  statusMessage: string;
  display: boolean;
  lat: number | null;
  lng: number | null;
  backGroundItem: string | null;
  backGroundItemType: 'image' | 'video' | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
  videoEditDescription: boolean;
  talkRoomMessageReceipt: boolean;
  showReceiveMessage: boolean;
};
