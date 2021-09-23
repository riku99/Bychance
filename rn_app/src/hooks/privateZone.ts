import {useCallback, useEffect, useState} from 'react';

import {PrivateZone} from '~/types';
import {useApikit} from './apikit';
import {useToastLoading} from './appState';
import {
  getRequestToPrivateZone,
  postRequestToPrivateZone,
  deleteRequestToPrivateZone,
} from '~/apis/privateZone';

export const usePrivateZone = () => {
  const [result, setResult] = useState<PrivateZone[]>();
  const [fetchLoading, setfetchLoading] = useState<boolean>(true);
  const {setToastLoading} = useToastLoading();

  const {
    dispatch,
    checkKeychain,
    addBearer,
    handleApiError,
    toast,
  } = useApikit();

  useEffect(() => {
    const _fetch = async () => {
      try {
        const _result = await getRequestToPrivateZone();
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
      setToastLoading(true);

      try {
        const _result = await postRequestToPrivateZone({
          address,
          lat,
          lng,
        });

        setToastLoading(false);
        toast?.show('作成しました', {type: 'success'});
        return _result.data;
      } catch (e) {
        handleApiError(e);
      }
      setToastLoading(false);
    },
    [handleApiError, toast, setToastLoading],
  );

  const deletePrivateZone = useCallback(
    async (id: number): Promise<boolean | void> => {
      setToastLoading(true);

      try {
        await deleteRequestToPrivateZone(id);
        toast?.show('削除しました', {type: 'success'});
        setToastLoading(false);
        return true;
      } catch (e) {
        handleApiError(e);
      }
      setToastLoading(false);
    },
    [handleApiError, toast, setToastLoading],
  );

  return {
    result,
    fetchLoading,
    createPrivateZone,
    deletePrivateZone,
  };
};
