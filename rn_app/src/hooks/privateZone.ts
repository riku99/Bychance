import {useCallback, useEffect, useState} from 'react';
import axios from 'axios';

import {baseUrl} from '~/constants/url';
import {PrivateZone} from '~/types';
import {useApikit} from './apikit';

export const usePrivateZone = () => {
  const [result, setResult] = useState<PrivateZone[]>();
  const [fetchLoading, setfetchLoading] = useState<boolean>(true);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const {
    dispatch,
    checkKeychain,
    addBearer,
    handleApiError,
    toast,
  } = useApikit();

  useEffect(() => {
    const _fetch = async () => {
      const credentials = await checkKeychain();
      try {
        const _result = await axios.get<PrivateZone[]>(
          `${baseUrl}/privateZone?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );
        setfetchLoading(false);
        setResult(_result.data);
      } catch (e) {
        handleApiError(e);
      }
      setfetchLoading(false);
    };

    _fetch();
  }, [dispatch, checkKeychain, handleApiError, addBearer]);

  const createPrivateZone = useCallback(
    async ({
      address,
      lat,
      lng,
    }: {
      address: string;
      lat: number;
      lng: number;
    }) => {
      setPostLoading(true);
      const credentials = await checkKeychain();

      try {
        const _result = await axios.post<PrivateZone>(
          `${baseUrl}/privateZone?id=${credentials?.id}`,
          {
            address,
            lat,
            lng,
          },
          addBearer(credentials?.token),
        );

        setPostLoading(false);
        toast?.show('作成しました', {type: 'success'});
        return _result.data;
      } catch (e) {
        handleApiError(e);
      }
      setPostLoading(false);
    },
    [addBearer, checkKeychain, handleApiError, toast],
  );

  const deletePrivateZone = useCallback(
    async (id: number): Promise<boolean | void> => {
      setDeleteLoading(true);

      const credentials = await checkKeychain();

      try {
        await axios.delete(
          `${baseUrl}/privateZone/${id}?id=${credentials?.id}`,
          addBearer(credentials?.token),
        );

        toast?.show('削除しました', {type: 'success'});
        setDeleteLoading(false);
        return true;
      } catch (e) {
        handleApiError(e);
      }
      setDeleteLoading(false);
    },
    [addBearer, checkKeychain, handleApiError, toast],
  );

  return {
    result,
    fetchLoading,
    postLoading,
    createPrivateZone,
    deleteLoading,
    deletePrivateZone,
  };
};
