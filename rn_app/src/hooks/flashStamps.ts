import {useCallback} from 'react';
import {useApikit} from './apikit';
import {default as axios} from 'axios';
import useSWR, {mutate as globalMutate} from 'swr';

import {baseUrl} from '~/constants/url';
import {StampValues} from '~/types/flashStamps';
import {GetFlashStampsResponse} from '~/types/response/flashStamps';

const getFlashStampsKey = (id: number) => `/flashes/${id}/stamps`;
export const useFlashStamps = ({flashId}: {flashId: number}) => {
  const {checkKeychain, addBearer, handleApiError} = useApikit();

  const _get = async () => {
    try {
      const credentials = await checkKeychain();
      const response = await axios.get<GetFlashStampsResponse>(
        `${baseUrl}${getFlashStampsKey(flashId)}?id=${credentials?.id}`,
        addBearer(credentials?.token),
      );

      return response.data;
    } catch (e) {
      handleApiError(e);
    }
  };
  const {data, mutate} = useSWR(`/flashes/${flashId}/stamps`, _get);

  const createFlashStamps = useCallback(
    async ({value, userId}: {value: string; userId: string}) => {
      mutate((current) => {
        if (!current) {
          return;
        }

        if (current[value]) {
          return {
            ...current,
            [value]: {
              userIds: [...current[value].userIds, userId],
            },
          };
        } else {
          return {
            ...current,
            [value]: {
              userIds: [userId],
            },
          };
        }
      }, false);

      const credentials = await checkKeychain();

      try {
        await axios.post<{
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
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError, flashId, mutate],
  );

  return {
    data,
    createFlashStamps,
  };
};

export const usePrefetchStamps = () => {
  const {addBearer, checkKeychain} = useApikit();
  const fetch = useCallback(
    async (id: number) => {
      try {
        const credentials = await checkKeychain();
        const response = await axios.get(
          `${baseUrl}${getFlashStampsKey(id)}?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );
        return response.data;
      } catch (e) {}
    },
    [addBearer, checkKeychain],
  );

  const prefetch = useCallback(
    (id: number) => {
      globalMutate(getFlashStampsKey(id), () => fetch(id));
    },
    [fetch],
  );

  return {
    prefetch,
  };
};
