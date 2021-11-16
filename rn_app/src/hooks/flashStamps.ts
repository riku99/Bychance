import {useCallback} from 'react';
import {useApikit} from './apikit';
import {default as axios} from 'axios';
import useSWR, {mutate as globalMutate} from 'swr';

import {baseUrl} from '~/constants/url';
import {
  getRequestToFlashStamps,
  postRequestToFlashStamps,
} from '~/apis/flashStamps';

const getFlashStampsKey = (id: number) => `/flashes/${id}/stamps`;
export const useFlashStamps = ({flashId}: {flashId: number}) => {
  const {handleApiError} = useApikit();

  const _get = async () => {
    try {
      const response = await getRequestToFlashStamps({flashId});
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

      try {
        await postRequestToFlashStamps({value, flashId});
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, flashId, mutate],
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
        const idToken = await getIdToken();
        const response = await axios.get(
          `${baseUrl}${getFlashStampsKey(id)}`,
          addBearer(idToken),
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
