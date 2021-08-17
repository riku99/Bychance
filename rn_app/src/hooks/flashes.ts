import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import fs from 'react-native-fs';
import {default as axios} from 'axios';

import {creatingFlash} from '~/stores/otherSettings';
import {getExtention} from '~/utils';
import {useApikit} from './apikit';
import {baseUrl} from '~/constants/url';
import {store} from '~/stores';
import {AnotherUser} from '~/stores/types';
import {updateNearbyUser} from '~/stores/nearbyUsers';
import {NearbyUser} from '~/types/nearbyUsers';
import {addFlash, removeFlash} from '~/stores/flashes';
import {Flash} from '~/types/flashes';
import {FlashStamp} from '~/types/FlashStamps';
import {addFlashStamp} from '~/stores/flashStamps';

export const useCreateFlash = () => {
  const navigation = useNavigation();

  const {
    dispatch,
    addBearer,
    checkKeychain,
    handleApiError,
    toast,
  } = useApikit();

  return useCallback(
    async ({sourceType, uri}: {sourceType: 'image' | 'video'; uri: string}) => {
      dispatch(creatingFlash());
      navigation.goBack();
      const ext = getExtention(uri);
      if (!ext) {
        toast?.show('無効なデータです', {type: 'danger'});
        return;
      }

      const credentials = await checkKeychain();

      try {
        const response = await axios.post<{flash: Flash; stamps: FlashStamp}>(
          `${baseUrl}/flashes?id=${credentials?.id}`,
          {
            source: await fs.readFile(uri, 'base64'),
            sourceType,
            ext,
          },
          addBearer(credentials?.token),
        );

        toast?.show('追加しました', {type: 'success'});

        dispatch(addFlash(response.data.flash));
        dispatch(addFlashStamp(response.data.stamps));
      } catch (e) {
        handleApiError(e);
      }

      dispatch(creatingFlash());
    },
    [dispatch, navigation, checkKeychain, addBearer, handleApiError, toast],
  );
};

export const useDeleteFlash = () => {
  const {checkKeychain, handleApiError, toast, addBearer} = useApikit();

  const deleteFlash = useCallback(
    async ({flashId}: {flashId: number}) => {
      const credentials = await checkKeychain();
      try {
        await axios.delete(
          `${baseUrl}/flashes/${flashId}?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );

        toast?.show('削除しました', {type: 'success'});
        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, handleApiError, toast, addBearer],
  );

  return {
    deleteFlash,
  };
};

export const useCreateAlreadyViewedFlash = () => {
  const {addBearer, checkKeychain, handleApiError, dispatch} = useApikit();

  const createUpdateObj = useCallback(
    <T extends AnotherUser | NearbyUser>({
      user,
      flashId,
    }: {
      user?: T;
      flashId: number;
    }): Promise<{id: string; changes: T} | void> => {
      return new Promise((resolve) => {
        if (user) {
          const viewedId = user.flashes.alreadyViewed.includes(flashId);
          if (!viewedId) {
            const f = user.flashes;
            const alreadyAllViewed =
              f.alreadyViewed.length + 1 === f.entities.length;
            const viewed = f.alreadyViewed;
            const updateData = {
              id: user.id,
              changes: {
                ...user,
                flashes: {
                  ...f,
                  alreadyViewed: [...viewed, flashId],
                  isAllAlreadyViewed: alreadyAllViewed,
                },
              },
            };

            resolve(updateData);
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      });
    },
    [],
  );

  const createAlreadyViewedFlash = useCallback(
    async ({flashId, userId}: {flashId: number; userId: string}) => {
      const credentials = await checkKeychain();
      try {
        await axios.post(
          `${baseUrl}/viewedFlashes?id=${credentials?.id}`,
          {
            flashId,
          },
          addBearer(credentials?.token),
        );

        const nearbyUser = store.getState().nearbyUsersReducer.entities[userId];
        const [result1] = await Promise.all([
          createUpdateObj({user: nearbyUser, flashId}),
          createUpdateObj({flashId}),
        ]);

        if (result1) {
          dispatch(updateNearbyUser(result1));
        }
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, dispatch, createUpdateObj],
  );

  return {
    createAlreadyViewedFlash,
  };
};
