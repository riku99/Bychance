import {useCallback, useEffect} from 'react';
import {useApikit} from './apikit';
import {default as axios} from 'axios';

import {baseUrl} from '~/constants/url';
import {StampValues} from '~/types/flashStamps';
import {updateFlashStamp, selectFlashStamp} from '~/stores/flashStamps';
import {store} from '~/stores';
import {GetFlashStampsResponse} from '~/types/response/flashStamps';

export const useCreateFlashStamps = () => {
  const {checkKeychain, addBearer, handleApiError, dispatch} = useApikit();

  const createFlashStamps = useCallback(
    async ({flashId, value}: {flashId: number; value: string}) => {
      const credentials = await checkKeychain();

      try {
        const response = await axios.post<{
          ownerId: string;
          flashId: number;
          value: StampValues;
          userId: string;
        }>(
          `${baseUrl}/flashStamps?id=${credentials?.id}`,
          {
            flashId,
            value,
          },
          addBearer(credentials?.token),
        );

        const {flashId: _flashId, value: _value, userId} = response.data;
        const targetData = selectFlashStamp(store.getState(), _flashId);
        if (targetData) {
          const targetValue = targetData.data[_value];
          if (targetValue) {
            const updateData = {
              id: flashId,
              changes: {
                flashId: targetData.flashId,
                data: {
                  ...targetData.data,
                  [value]: {
                    number: targetValue.number += 1,
                    userIds: [...targetValue.userIds, userId],
                  },
                },
              },
            };

            dispatch(updateFlashStamp(updateData));
          }
        }
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, dispatch],
  );

  return {
    createFlashStamps,
  };
};

export const useFlashStamps = ({flashId}: {flashId: number}) => {
  const {checkKeychain, addBearer} = useApikit();

  useEffect(() => {
    const _get = async () => {
      try {
        const credentials = await checkKeychain();
        const response = await axios.get<GetFlashStampsResponse>(
          `${baseUrl}/flashes/${flashId}/stamps?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );

        console.log(response.data);
      } catch (e) {}
    };
    _get();
  }, [flashId, addBearer, checkKeychain]);
};
