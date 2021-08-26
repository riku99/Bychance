import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import fs from 'react-native-fs';
import {default as axios} from 'axios';
import {useSelector} from 'react-redux';

import {getExtention} from '~/utils';
import {useApikit} from './apikit';
import {baseUrl} from '~/constants/url';
import {RootState} from '~/stores';
import {addFlash, removeFlash} from '~/stores/flashes';
import {CreateFlashResponse} from '~/types/response/flashes';
import {useCreatingFlash} from '~/hooks/appState';
import {useCustomDispatch} from './stores';
import {
  selectFlashesByUserId,
  removeFlashes,
  upsertFlashes,
  updateFlash,
} from '~/stores/flashes';
import {Flash} from '~/types/store/flashes';

export const useCreateFlash = () => {
  const navigation = useNavigation();

  const {
    dispatch,
    addBearer,
    checkKeychain,
    handleApiError,
    toast,
  } = useApikit();

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

      const credentials = await checkKeychain();

      try {
        const response = await axios.post<CreateFlashResponse>(
          `${baseUrl}/flashes?id=${credentials?.id}`,
          {
            source: await fs.readFile(uri, 'base64'),
            sourceType,
            ext,
          },
          addBearer(credentials?.token),
        );

        dispatch(addFlash({...response.data, viewed: [], viewerViewed: false}));
        toast?.show('追加しました', {type: 'success'});
      } catch (e) {
        handleApiError(e);
      }

      setCreatingFlash(false);
    },
    [
      dispatch,
      navigation,
      checkKeychain,
      addBearer,
      handleApiError,
      toast,
      setCreatingFlash,
    ],
  );
};

export const useDeleteFlash = () => {
  const {
    checkKeychain,
    handleApiError,
    toast,
    addBearer,
    dispatch,
  } = useApikit();

  const deleteFlash = useCallback(
    async ({flashId}: {flashId: number}) => {
      const credentials = await checkKeychain();
      try {
        await axios.delete(
          `${baseUrl}/flashes/${flashId}?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );

        dispatch(removeFlash(flashId));
        toast?.show('削除しました', {type: 'success'});
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, handleApiError, toast, addBearer, dispatch],
  );

  return {
    deleteFlash,
  };
};

export const useViewed = () => {
  const {addBearer, dispatch, checkKeychain} = useApikit();

  const createViewed = useCallback(
    async ({
      flashId,
      userIds,
    }: {
      flashId: number;
      userIds: {userId: string}[];
    }) => {
      try {
        const credentials = await checkKeychain();
        await axios.post(
          `${baseUrl}/flashes/viewed?id=${credentials?.id}`,
          {flashId},
          addBearer(credentials?.token),
        );

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
    [addBearer, dispatch, checkKeychain],
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
