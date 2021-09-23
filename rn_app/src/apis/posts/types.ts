type Post = {
  id: number;
  text: string | null;
  url: string;
  createdAt: string;
  userId: string;
  sourceType: 'image' | 'video';
};

export type ResponseForGetPosts = Post[];

export type ResponseForPostPosts = Post;
