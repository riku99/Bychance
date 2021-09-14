export type Flash = {
  id: number;
  source: string;
  sourceType: 'image' | 'video';
  createdAt: string;
  viewed: {userId: string}[];
  [key: string]: any | undefined;
};
