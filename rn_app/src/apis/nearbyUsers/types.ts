export type ResponseForGetNearbyUsers = {
  id: string;
  name: string;
  avatar: string | null;
  statusMessage: string | null;
  introduce: string | null;
  lat: number;
  lng: number;
  flashes: {
    id: number;
    source: string;
    sourceType: 'image' | 'video';
    userId: string;
    createdAt: string;
    viewed: {userId: string}[];
  }[];
}[];
