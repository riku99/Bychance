import {useCallback} from 'react';
import {useApikit} from './apikit';
import {default as axios} from 'axios';
import useSWR from 'swr';
import {shallowEqual, useSelector} from 'react-redux';

import {baseUrl} from '~/constants/url';
import {GetUserPostsResponse, CreatePostResponse} from '~/types/response/posts';
import {
  removePost,
  selectPostsByUserId,
  removePosts,
  upsertPosts,
} from '~/stores/posts';
import {useCustomDispatch} from './stores';
import {Post} from '~/types/store/posts';
import {RootState} from '~/stores';

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
        const response = await axios.post<CreatePostResponse>(
          `${baseUrl}/posts?id=${credentials?.id}`,
          {text, source, ext, sourceType},
          addBearer(credentials?.token),
        );

        toast?.show('投稿しました', {type: 'success'});
        return response.data;
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
  const {
    checkKeychain,
    addBearer,
    handleApiError,
    toast,
    dispatch,
  } = useApikit();

  const deletePost = useCallback(
    async ({postId}: {postId: number}) => {
      const credentials = await checkKeychain();

      try {
        await axios.delete(
          `${baseUrl}/posts/${postId}?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );

        dispatch(removePost(postId));
        toast?.show('削除しました', {type: 'success'});
      } catch (e) {
        handleApiError(e);
      }
    },

    [checkKeychain, addBearer, handleApiError, toast, dispatch],
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

export const useRefreshUserPosts = (userId: string) => {
  const dispatch = useCustomDispatch();

  const current = useSelector(
    (state: RootState) => selectPostsByUserId(state, userId),
    shallowEqual,
  );

  const refreshPosts = useCallback(
    ({posts}: {posts: Post[]}) => {
      const nIds = posts.map((p) => p.id);
      const removed = current.map((_) => _.id).filter((c) => !nIds.includes(c));

      if (removed.length) {
        dispatch(removePosts(removed));
      }

      dispatch(upsertPosts(posts));
    },
    [current, dispatch],
  );

  return {
    refreshPosts,
  };
};
