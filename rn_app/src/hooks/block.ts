import {useCallback} from 'react';
import {RNToasty} from 'react-native-toasty';

import {useApikit} from './apikit';
import {updateUser} from '~/stores/_users';
import {useToastLoading} from './appState';
import {postRequestToBlocks, deleteRequestToBlocks} from '~/apis/blocks';

export const useCreateBlock = () => {
  const {handleApiError, dispatch} = useApikit();
  const {setToastLoading} = useToastLoading();

  const block = useCallback(
    async ({blockTo}: {blockTo: string}) => {
      setToastLoading(true);
      try {
        await postRequestToBlocks({blockTo});

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
    [handleApiError, dispatch, setToastLoading],
  );

  return {
    block,
  };
};

export const useDeleteBlock = () => {
  const {handleApiError, dispatch} = useApikit();
  const {setToastLoading} = useToastLoading();

  const deleteBlock = useCallback(
    async ({userId}: {userId: string}) => {
      setToastLoading(true);
      try {
        await deleteRequestToBlocks({userId});
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
    [handleApiError, dispatch, setToastLoading],
  );

  return {
    deleteBlock,
  };
};
