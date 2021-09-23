import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import fs from 'react-native-fs';
import {shallowEqual, useSelector} from 'react-redux';

import {getExtention} from '~/utils';
import {useApikit} from './apikit';
import {RootState} from '~/stores';
import {addFlash, removeFlash} from '~/stores/flashes';
import {useCreatingFlash} from '~/hooks/appState';
import {useCustomDispatch} from './stores';
import {
  selectFlashesByUserId,
  removeFlashes,
  upsertFlashes,
  updateFlash,
} from '~/stores/flashes';
import {Flash} from '~/types/store/flashes';
import {
  postRequestToFlashes,
  postRequestToFlashesViewed,
  deleteRequestToFlashes,
} from '~/apis/flashes';

export const useFlashes = ({userId}: {userId: string}) =>
  useSelector(
    (state: RootState) => selectFlashesByUserId(state, userId),
    shallowEqual,
  );

export const useCreateFlash = () => {
  const navigation = useNavigation();
  const {dispatch, handleApiError, toast} = useApikit();
  const {setCreatingFlash} = useCreatingFlash();

  return useCallback(
    async ({sourceType, uri}: {sourceType: 'image' | 'video'; uri: string}) => {
      setCreatingFlash(true);
      navigation.goBack();
      const ext = getExtention(uri);

      if (!ext) {
        toast?.show('無効なデータです', {type: 'danger'});
        return;
      }

      const source = await fs.readFile(uri, 'base64');

      try {
        const response = await postRequestToFlashes({source, sourceType, ext});

        dispatch(addFlash({...response.data, viewed: [], viewerViewed: false}));
        toast?.show('追加しました', {type: 'success'});
      } catch (e) {
        handleApiError(e);
      }

      setCreatingFlash(false);
    },
    [dispatch, navigation, handleApiError, toast, setCreatingFlash],
  );
};

export const useDeleteFlash = () => {
  const {handleApiError, toast, dispatch} = useApikit();

  const deleteFlash = useCallback(
    async ({flashId}: {flashId: number}) => {
      try {
        await deleteRequestToFlashes({flashId});

        dispatch(removeFlash(flashId));
        toast?.show('削除しました', {type: 'success'});
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, toast, dispatch],
  );

  return {
    deleteFlash,
  };
};

export const useViewed = () => {
  const {dispatch} = useApikit();

  const createViewed = useCallback(
    async ({
      flashId,
      userIds,
    }: {
      flashId: number;
      userIds: {userId: string}[];
    }) => {
      try {
        await postRequestToFlashesViewed({flashId});

        dispatch(
          updateFlash({
            id: flashId,
            changes: {
              viewerViewed: true,
              viewed: userIds,
            },
          }),
        );
      } catch (e) {}
    },
    [dispatch],
  );

  return {
    createViewed,
  };
};

export const useRefreshUserFlashes = (userId: string) => {
  const dispatch = useCustomDispatch();

  const current = useSelector((state: RootState) =>
    selectFlashesByUserId(state, userId),
  );

  const refreshFlashes = useCallback(
    ({flashes}: {flashes: Flash[]}) => {
      const nIds = flashes.map((f) => f.id);
      const removed = current.map((_) => _.id).filter((c) => !nIds.includes(c));

      dispatch(removeFlashes(removed));
      dispatch(upsertFlashes(flashes));
    },
    [current, dispatch],
  );

  return {
    refreshFlashes,
  };
};
