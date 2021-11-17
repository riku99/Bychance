import {axios, addBearer, baseUrl, getIdToken} from '../export';
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
  const idToken = await getIdToken();
  return await axios.post<ResponseForPostPosts>(
    `${baseUrl}/posts`,
    {text, source, ext, sourceType},
    addBearer(idToken),
  );
};

export const deleteRequestToPosts = async ({postId}: {postId: number}) => {
  const idToken = await getIdToken();
  return await axios.delete(`${baseUrl}/posts/${postId}`, addBearer(idToken));
};

export const getRequestToPosts = async (userId: string) => {
  const idToken = await getIdToken();
  return await axios.get<ResponseForGetPosts>(
    `${baseUrl}/users/${userId}/posts`,
    addBearer(idToken),
  );
};
