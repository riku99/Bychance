import {useCallback, useEffect, useState} from 'react';

import {PrivateTime} from '~/types';
import {useApikit} from './apikit';
import {useToastLoading} from './appState';
import {
  getRequestToPrivateTime,
  postRequestToPrivateTime,
  deleteRequestToPrivateTime,
} from '~/apis/privateTime';

export const usePrivateTime = () => {
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchResult, setFetchResult] = useState<PrivateTime[]>();
  const {setToastLoading} = useToastLoading();

  const {checkKeychain, addBearer, handleApiError, toast} = useApikit();

  useEffect(() => {
    const _fetch = async () => {
      try {
        const response = await getRequestToPrivateTime();
        setFetchLoading(false);
        setFetchResult(response.data);
      } catch (e) {
        handleApiError(e);
      }
      setFetchLoading(false);
    };

    _fetch();
  }, [checkKeychain, addBearer, handleApiError, toast]);

  const createPrivateTime = useCallback(
    async ({
      startHours,
      startMinutes,
      endHours,
      endMinutes,
    }: {
      startHours: number;
      startMinutes: number;
      endHours: number;
      endMinutes: number;
    }) => {
      setToastLoading(true);

      try {
        const apiResult = await postRequestToPrivateTime({
          startHours,
          startMinutes,
          endHours,
          endMinutes,
        });
        setToastLoading(false);
        toast?.show('作成しました', {type: 'success'});
        return apiResult.data;
      } catch (e) {
        handleApiError(e);
      }
      setToastLoading(false);
    },
    [handleApiError, toast, setToastLoading],
  );

  const deletePrivateTime = useCallback(
    async (id: number) => {
      setToastLoading(true);

      try {
        await deleteRequestToPrivateTime(id);
        setToastLoading(false);
        toast?.show('削除しました', {type: 'success'});
        return true;
      } catch (e) {
        handleApiError(e);
      }

      setToastLoading(false);
    },
    [handleApiError, toast, setToastLoading],
  );

  return {
    createPrivateTime,
    fetchLoading,
    fetchResult,
    deletePrivateTime,
  };
};
