export type UserPageInfo = {
  id: string;
  name: string;
  avatar: string | null;
  introduce: string | null;
  backGroundItem: string | null;
  backGroundItemType: 'image' | 'video' | null;
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
  }[];
  flashesData: {
    entities: {
      id: number;
      source: string;
      createdAt: string;
      sourceType: 'image' | 'video';
      userId: string;
      viewed: {userId: string}[];
    }[];
    viewerViewedFlasheIds: number[];
    viewedAllFlashes: boolean;
  };
};
