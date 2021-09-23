import {addBearer, axios, baseUrl, checkKeychain} from '../export';
import {ResponseForGetPosts, ResponseForPostPosts} from './types';

export const postRequestToPosts = async ({
  text,
  sourceType,
  source,
  ext,
}: {
  text: string;
  source: string;
  ext: string;
  sourceType: 'image' | 'video';
}) => {
  const credentials = await checkKeychain();
  return await axios.post<ResponseForPostPosts>(
    `${baseUrl}/posts?id=${credentials?.id}`,
    {text, source, ext, sourceType},
    addBearer(credentials?.token),
  );
};

export const deleteRequestToPosts = async ({postId}: {postId: number}) => {
  const credentials = await checkKeychain();
  return await axios.delete(
    `${baseUrl}/posts/${postId}?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};

export const getRequestToPosts = async (userId: string) => {
  const credentials = await checkKeychain();
  return await axios.get<ResponseForGetPosts>(
    `${baseUrl}/users/${userId}/posts?id=${credentials?.id}`,
    addBearer(credentials?.token),
  );
};
