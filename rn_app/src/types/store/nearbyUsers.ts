export type NearbyUser = {
  id: string;
  name: string;
  avatar: string | null;
  statusMessage: string | null;
  introduce: string | null;
  lat: number;
  lng: number;
  flashesData: {
    entities: {
      id: number;
      source: string;
      sourceType: 'image' | 'video';
      userId: string;
      viewed: {userId: string}[];
      createdAt: string;
      specificUserViewed: {flashId: number}[]; // 使わないからサーバー側で消すかも
    }[];
    viewerViewedFlasheIds: number[];
    viewedAllFlashes: boolean;
  };
};
