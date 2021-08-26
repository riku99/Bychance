export type Flash = {
  id: number;
  source: string;
  sourceType: 'image' | 'video';
  createdAt: string;
  userId: string;
  viewed: {userId: string}[];
  viewerViewed: boolean;
};
