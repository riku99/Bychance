import {useCallback, useEffect, useState} from 'react';
import axios from 'axios';

import {baseUrl} from '~/constants/url';
import {PrivateTime} from '~/types';
import {useApikit} from './apikit';

export const usePrivateTime = () => {
  const [postLoading, setPostLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchResult, setFetchResult] = useState<PrivateTime[]>();
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      setPostLoading(true);
      const credentials = await checkKeychain();
      try {
        const apiResult = await axios.post<PrivateTime>(
          `${baseUrl}/privateTime?id=${credentials?.id}`,
          {startHours, startMinutes, endHours, endMinutes},
          addBearer(credentials?.token),
        );
        setPostLoading(false);
        toast?.show('作成しました', {type: 'success'});
        return apiResult.data;
      } catch (e) {
        handleApiError(e);
      }
      setPostLoading(false);
    },
    [checkKeychain, addBearer, handleApiError, toast],
  );

  const deletePrivateTime = useCallback(
    async (id: number) => {
      setDeleteLoading(true);

      const credentials = await checkKeychain();

      try {
        await axios.delete(
          `${baseUrl}/privateTime/${id}?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );
        setDeleteLoading(false);
        toast?.show('削除しました', {type: 'success'});
        return true;
      } catch (e) {
        handleApiError(e);
      }

      setDeleteLoading(false);
    },
    [checkKeychain, addBearer, handleApiError, toast],
  );

  return {
    postLoading,
    createPrivateTime,
    fetchLoading,
    fetchResult,
    deletePrivateTime,
    deleteLoading,
  };
};
