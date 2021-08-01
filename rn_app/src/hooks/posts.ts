import {useCallback} from 'react';
import {useApikit} from './apikit';
import {default as axios} from 'axios';

import {baseUrl} from '~/constants/url';
import {addPost} from '~/stores/posts';
import {Post} from '~/types/posts';

export const useCreatePost = () => {
  const {
    checkKeychain,
    addBearer,
    handleApiError,
    dispatch,
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

        dispatch(addPost(response.data));

        toast?.show('投稿しました', {type: 'success'});
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, dispatch, toast],
  );

  return {
    createPost,
  };
};
