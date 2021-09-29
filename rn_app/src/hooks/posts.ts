import {useCallback} from 'react';
import {useApikit} from './apikit';
import useSWR from 'swr';
import {shallowEqual, useSelector} from 'react-redux';

import {
  removePost,
  selectPostsByUserId,
  removePosts,
  upsertPosts,
} from '~/stores/posts';
import {useCustomDispatch} from './stores';
import {Post} from '~/stores/posts';
import {RootState} from '~/stores';
import {
  postRequestToPosts,
  getRequestToPosts,
  deleteRequestToPosts,
} from '~/apis/posts';

export const usePosts = ({userId}: {userId: string}) =>
  useSelector(
    (state: RootState) => selectPostsByUserId(state, userId),
    shallowEqual,
  );

export const useCreatePost = () => {
  const {handleApiError, toast} = useApikit();

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
      try {
        const response = await postRequestToPosts({
          text,
          source,
          sourceType,
          ext,
        });

        toast?.show('投稿しました', {type: 'success'});
        return response.data;
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, toast],
  );

  return {
    createPost,
  };
};

export const useDeletePost = () => {
  const {handleApiError, toast, dispatch} = useApikit();

  const deletePost = useCallback(
    async ({postId}: {postId: number}) => {
      try {
        await deleteRequestToPosts({postId});

        dispatch(removePost(postId));
        toast?.show('削除しました', {type: 'success'});
      } catch (e) {
        handleApiError(e);
      }
    },

    [handleApiError, toast, dispatch],
  );

  return {
    deletePost,
  };
};

export const useGetUserPosts = (userId: string) => {
  const {handleApiError} = useApikit();

  const fetcher = async () => {
    try {
      const response = await getRequestToPosts(userId);

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
