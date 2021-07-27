import {useCallback, useEffect, useState} from 'react';
import axios from 'axios';

import {checkKeychain} from '~/helpers/credentials';
import {origin} from '~/constants/url';
import {headers} from '~/helpers/requestHeaders';
import {PrivateTime} from '~/types';
import {
  handleCredentialsError,
  handleBasicApiErrorWithDispatch,
} from '~/helpers/errors';
import {showBottomToast} from '~/stores/bottomToast';
import {useCustomDispatch} from './stores';

export const usePrivateTime = () => {
  const dispatch = useCustomDispatch();
  const [postLoading, setPostLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchResult, setFetchResult] = useState<PrivateTime[]>();
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const _fetch = async () => {
      const credentials = await checkKeychain();

      if (credentials) {
        try {
          const _result = await axios.get<PrivateTime[]>(
            `${origin}/privateTime?id=${credentials.id}`,
            headers(credentials.token),
          );

          setFetchLoading(false);
          setFetchResult(_result.data);
        } catch (e) {
          handleBasicApiErrorWithDispatch({e, dispatch});
        }
      } else {
        handleCredentialsError(dispatch);
      }
      setFetchLoading(false);
    };
    _fetch();
  }, [dispatch]);

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
      if (credentials) {
        try {
          const apiResult = await axios.post<PrivateTime>(
            `${origin}/privateTime?id=${credentials.id}`,
            {startHours, startMinutes, endHours, endMinutes},
            headers(credentials.token),
          );
          setPostLoading(false);
          dispatch(
            showBottomToast({
              data: {
                message: '作成しました',
                type: 'success',
                timestamp: new Date().toString(),
              },
            }),
          );

          return apiResult.data;
        } catch (e) {
          handleBasicApiErrorWithDispatch({e, dispatch});
        }
      } else {
        handleCredentialsError(dispatch);
      }
      setPostLoading(false);
    },
    [dispatch],
  );

  const deletePrivateTime = useCallback(
    async (id: number) => {
      setDeleteLoading(true);

      const credentials = await checkKeychain();

      if (credentials) {
        try {
          await axios.delete(
            `${origin}/privateTime/${id}?id=${credentials.id}`,
            headers(credentials.token),
          );

          setDeleteLoading(false);
          dispatch(
            showBottomToast({
              data: {
                message: '削除しました',
                type: 'success',
                timestamp: new Date().toString(),
              },
            }),
          );
          return true;
        } catch (e) {
          handleBasicApiErrorWithDispatch({e, dispatch});
        }
      } else {
        handleCredentialsError(dispatch);
      }

      setDeleteLoading(false);
    },
    [dispatch],
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
