import {useCallback} from 'react';
import {default as axios} from 'axios';
import {RNToasty} from 'react-native-toasty';

import {useApikit} from './apikit';
import {baseUrl} from '~/constants/url';
import {updateUser} from '~/stores/_users';
import {useToastLoading} from './appState';

export const useCreateBlock = () => {
  const {addBearer, checkKeychain, handleApiError, dispatch} = useApikit();
  const {setToastLoading} = useToastLoading();

  const block = useCallback(
    async ({blockTo}: {blockTo: string}) => {
      setToastLoading(true);
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
        setToastLoading(false);
        return true;
      } catch (e) {
        handleApiError(e);
      } finally {
      }
    },
    [handleApiError, addBearer, checkKeychain, dispatch, setToastLoading],
  );

  return {
    block,
  };
};

export const useDeleteBlock = () => {
  const {addBearer, checkKeychain, handleApiError, dispatch} = useApikit();
  const {setToastLoading} = useToastLoading();

  const deleteBlock = useCallback(
    async ({userId}: {userId: string}) => {
      setToastLoading(true);
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
        setToastLoading(false);
      }
    },
    [addBearer, checkKeychain, handleApiError, dispatch, setToastLoading],
  );

  return {
    deleteBlock,
  };
};
