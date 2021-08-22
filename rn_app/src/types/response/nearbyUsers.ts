export type GetNearbyUsersReponse = {
  id: string;
  name: string;
  avatar: string | null;
  statusMessage: string | null;
  introduce: string | null;
  flashesData: {
    entites: {
      id: number;
      source: string;
      userId: string;
      viewed: {userId: string}[];
      specificUserViewed: {flashId: number}[];
    }[];
    viewerViewedFlasheIds: number[];
    viewedAllFlashes: boolean;
  };
}[];
