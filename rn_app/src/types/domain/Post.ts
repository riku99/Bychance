export type Post = {
  id: number;
  text: string | null;
  url: string;
  createdAt: string;
  userId: string;
  sourceType: 'image' | 'video';
};
