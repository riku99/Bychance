import {useCallback, useState} from 'react';
import {default as axios} from 'axios';
import {RNToasty} from 'react-native-toasty';

import {useApikit} from './apikit';
import {baseUrl} from '~/constants/url';
import {updateUser} from '~/stores/_users';
import {useRemovePostsAndFlashesDispatch} from './stores';

export const useCreateBlcok = ({blockTo}: {blockTo: string}) => {
  const {addBearer, checkKeychain, handleApiError, dispatch} = useApikit();
  const [isLoading, setIsLoading] = useState(false);
  const {removeDispatch} = useRemovePostsAndFlashesDispatch({userId: blockTo});

  const block = useCallback(async () => {
    setIsLoading(true);
    try {
      const credentials = await checkKeychain();

      await axios.post(
        `${baseUrl}/users/block?id=${credentials?.id}`,
        {blockTo},
        addBearer(credentials?.token),
      );

      RNToasty.Show({
        title: 'ブロックしました',
        position: 'center',
      });
      dispatch(updateUser({id: blockTo, changes: {block: true}}));
      removeDispatch();
    } catch (e) {
      handleApiError(e);
    } finally {
      setIsLoading(false);
    }
  }, [
    handleApiError,
    addBearer,
    checkKeychain,
    dispatch,
    blockTo,
    removeDispatch,
  ]);

  return {
    block,
    isLoading,
  };
};

export const useDeleteBlock = () => {
  const {addBearer, checkKeychain, handleApiError, dispatch} = useApikit();
  const [isLoading, setIsLoading] = useState(false);

  const deleteBlock = useCallback(
    async ({userId}: {userId: string}) => {
      setIsLoading(true);
      try {
        const credentials = await checkKeychain();
        await axios.delete(
          `${baseUrl}/users/${userId}/block?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );

        RNToasty.Show({
          title: '解除しました',
          position: 'center',
        });
        dispatch(updateUser({id: userId, changes: {block: false}}));
      } catch (e) {
        handleApiError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [addBearer, checkKeychain, handleApiError, dispatch],
  );

  return {
    deleteBlock,
    isLoading,
  };
};
