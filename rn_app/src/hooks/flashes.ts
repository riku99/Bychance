import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import fs from 'react-native-fs';

import {createFlashThunk} from '~/thunks/flashes/createFlash';
import {creatingFlash} from '~/stores/otherSettings';
import {getExtention} from '~/utils';
import {useCustomDispatch} from '~/hooks/stores';
import {showBottomToast} from '~/stores/bottomToast';
import {useApikit} from './apikit';
import {axios} from '~/thunks/re-modules';
import {baseUrl} from '~/constants/url';
import {store} from '~/stores';
import {updateChatPartner} from '~/stores/chatPartners';
import {AnotherUser} from '~/stores/types';
import {updateNearbyUser} from '~/stores/nearbyUsers';
import {NearbyUser} from '~/types/nearbyUsers';

export const useCreateFlash = () => {
  const navigation = useNavigation();
  const dispatch = useCustomDispatch();

  return useCallback(
    async ({sourceType, uri}: {sourceType: 'image' | 'video'; uri: string}) => {
      dispatch(creatingFlash());
      navigation.goBack();
      const ext = getExtention(uri);
      if (!ext) {
        dispatch(
          showBottomToast({
            data: {
              type: 'danger',
              message: '無効なデータです',
            },
          }),
        );
        return;
      }

      await dispatch(
        createFlashThunk({
          source: await fs.readFile(uri, 'base64'),
          sourceType,
          ext,
        }),
      );

      dispatch(creatingFlash());
    },
    [dispatch, navigation],
  );
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
        const chatPartner = store.getState().chatPartnersReducer.entities[
          userId
        ];
        const [result1, result2] = await Promise.all([
          createUpdateObj({user: nearbyUser, flashId}),
          createUpdateObj({user: chatPartner, flashId}),
        ]);

        if (result1) {
          dispatch(updateNearbyUser(result1));
        }

        if (result2) {
          dispatch(updateChatPartner(result2));
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
