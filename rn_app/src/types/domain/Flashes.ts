export type StampValues = 'thumbsUp' | 'yusyo' | 'yoi' | 'itibann' | 'seikai';

type FlasheStamp = {
  id: number;
  createdAt: string;
  value: StampValues;
  userId: string;
  flashId: number;
};

export type Flash = {
  id: number;
  source: string;
  sourceType: 'image' | 'video';
  createdAt: string;
  viewed: {userId: string}[];
  stamps: FlasheStamp[];
};
