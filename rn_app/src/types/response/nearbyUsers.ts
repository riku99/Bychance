export type GetNearbyUsersReponse = {
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
      createdAt: string;
      viewed: {userId: string}[];
      specificUserViewed: {flashId: number}[];
    }[];
    viewerViewedFlasheIds: number[];
    viewedAllFlashes: boolean;
  };
}[];
