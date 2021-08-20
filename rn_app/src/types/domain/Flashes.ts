type FlasheStamp = {
  id: number;
  createdAt: string;
  userId: string;
  flashId: number;
};

export type Flash = {
  id: number;
  source: string;
  sourceType: 'image' | 'video';
  createdAt: string;
  viewed: {userId: string}[];
};
