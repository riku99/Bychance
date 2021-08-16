import {useCallback} from 'react';
import {useApikit} from './apikit';
import {default as axios} from 'axios';
import useSWR from 'swr';
import {useFocusEffect} from '@react-navigation/native';

import {baseUrl} from '~/constants/url';
import {Post} from '~/types/posts';
import {GetUserPostsResponse} from '~/types/response/posts';

export const useCreatePost = () => {
  const {
    checkKeychain,
    addBearer,
    handleApiError,

    toast,
  } = useApikit();

  const createPost = useCallback(
    async ({
      text,
      source,
      sourceType,
      ext,
    }: {
      text: string;
      source: string;
      ext: string;
      sourceType: 'image' | 'video';
    }) => {
      const credentials = await checkKeychain();

      try {
        const response = await axios.post<Post>(
          `${baseUrl}/posts?id=${credentials?.id}`,
          {text, source, ext, sourceType},
          addBearer(credentials?.token),
        );

        toast?.show('投稿しました', {type: 'success'});
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, toast],
  );

  return {
    createPost,
  };
};

export const useDeletePost = () => {
  const {checkKeychain, addBearer, handleApiError, toast} = useApikit();

  const deletePost = useCallback(
    async ({postId}: {postId: number}) => {
      const credentials = await checkKeychain();

      try {
        await axios.delete(
          `${baseUrl}/posts/${postId}?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );

        toast?.show('削除しました', {type: 'success'});
      } catch (e) {
        handleApiError(e);
      }
    },

    [checkKeychain, addBearer, handleApiError, toast],
  );

  return {
    deletePost,
  };
};

export const useGetUserPosts = (userId: string) => {
  const {checkKeychain, addBearer, handleApiError} = useApikit();

  const fetcher = async () => {
    try {
      const credentials = await checkKeychain();
      const response = await axios.get<GetUserPostsResponse>(
        `${baseUrl}/users/${userId}/posts?id=${credentials?.id}`,
        addBearer(credentials?.token),
      );

      return response.data;
    } catch (e) {
      handleApiError(e);
    }
  };

  const {data, revalidate} = useSWR(`/users/${userId}/posts`, fetcher);

  return {
    data,
    revalidate,
  };
};
