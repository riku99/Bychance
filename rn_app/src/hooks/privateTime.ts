import {useCallback, useEffect, useState} from 'react';
import axios from 'axios';

import {baseUrl} from '~/constants/url';
import {PrivateTime} from '~/types';
import {useApikit} from './apikit';
import {useToastLoading} from './appState';

export const usePrivateTime = () => {
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchResult, setFetchResult] = useState<PrivateTime[]>();
  const {setToastLoading} = useToastLoading();

  const {checkKeychain, addBearer, handleApiError, toast} = useApikit();

  useEffect(() => {
    const _fetch = async () => {
      const credentials = await checkKeychain();

      try {
        const _result = await axios.get<PrivateTime[]>(
          `${baseUrl}/privateTime?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );
        setFetchLoading(false);
        setFetchResult(_result.data);
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
      const credentials = await checkKeychain();
      try {
        const apiResult = await axios.post<PrivateTime>(
          `${baseUrl}/privateTime?id=${credentials?.id}`,
          {startHours, startMinutes, endHours, endMinutes},
          addBearer(credentials?.token),
        );
        setToastLoading(false);
        toast?.show('作成しました', {type: 'success'});
        return apiResult.data;
      } catch (e) {
        handleApiError(e);
      }
      setToastLoading(false);
    },
    [checkKeychain, addBearer, handleApiError, toast, setToastLoading],
  );

  const deletePrivateTime = useCallback(
    async (id: number) => {
      setToastLoading(true);

      const credentials = await checkKeychain();

      try {
        await axios.delete(
          `${baseUrl}/privateTime/${id}?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );
        setToastLoading(false);
        toast?.show('削除しました', {type: 'success'});
        return true;
      } catch (e) {
        handleApiError(e);
      }

      setToastLoading(false);
    },
    [checkKeychain, addBearer, handleApiError, toast, setToastLoading],
  );

  return {
    createPrivateTime,
    fetchLoading,
    fetchResult,
    deletePrivateTime,
  };
};
