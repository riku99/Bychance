import {useCallback, useState} from 'react';
import {default as axios} from 'axios';
import {RNToasty} from 'react-native-toasty';

import {useApikit} from './apikit';
import {baseUrl} from '~/constants/url';
import {updateUser} from '~/stores/_users';

export const useCreateBlcok = () => {
  const {addBearer, checkKeychain, handleApiError, dispatch} = useApikit();
  const [isLoading, setIsLoading] = useState(false);

  const block = useCallback(
    async ({blockTo}: {blockTo: string}) => {
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
      } catch (e) {
        handleApiError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError, addBearer, checkKeychain, dispatch],
  );

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
