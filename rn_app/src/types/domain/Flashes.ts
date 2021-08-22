export type Flash = {
  id: number;
  source: string;
  sourceType: 'image' | 'video';
  createdAt: string;
  viewed: {userId: string}[];
  [key: string]: any | undefined;
};

const a: Flash = {
  id: 1,
  source: 'de',
  sourceType: 'image',
  createdAt: 'ede',
  viewed: [],
  specificUserViewed: [
    {
      specificUserViewed: {
        flashId: 1,
      },
    },
  ],
};
console.log(a);
