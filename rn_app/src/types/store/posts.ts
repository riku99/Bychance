export type Post = {
  id: number;
  text: string | null;
  url: string;
  sourceType: 'image' | 'video';
  createdAt: string;
  userId: string;
};
