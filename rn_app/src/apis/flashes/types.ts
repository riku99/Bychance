export type ResponseForPostFlashes = {
  id: number;
  createdAt: string;
  source: string;
  sourceType: 'image' | 'video';
  userId: string;
};
