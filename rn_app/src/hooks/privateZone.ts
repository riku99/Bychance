import {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {useToast} from 'react-native-fast-toast';

import {checkKeychain} from '~/helpers/credentials';
import {origin} from '~/constants/origin';
import {headers} from '~/helpers/requestHeaders';
import {PrivateZone} from '~/types';
import {useCustomDispatch} from './stores';
import {
  handleCredentialsError,
  handleBasicApiErrorWithDispatch,
} from '~/helpers/errors';
import {showBottomToast} from '~/stores/bottomToast';

export const usePrivateZone = () => {
  const bottomToast = useToast();
  const dispatch = useCustomDispatch();

  const [result, setResult] = useState<PrivateZone[]>();
  const [fetchLoading, setfetchLoading] = useState<boolean>(true);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    const _fetch = async () => {
      const credentials = await checkKeychain();
      if (credentials) {
        try {
          const _result = await axios.get<PrivateZone[]>(
            `${origin}/privateZone?id=${credentials.id}`,
            headers(credentials.token),
          );
          setResult(_result.data);
        } catch (e) {
          handleBasicApiErrorWithDispatch({e, dispatch});
        }
      } else {
        handleCredentialsError(dispatch);
      }
      setfetchLoading(false);
    };

    _fetch();
  }, [dispatch, bottomToast]);

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

      if (credentials) {
        try {
          const _result = await axios.post<PrivateZone>(
            `${origin}/privateZone?id=${credentials.id}`,
            {
              address,
              lat,
              lng,
            },
            headers(credentials.token),
          );

          setPostLoading(false);
          dispatch(
            showBottomToast({
              data: {
                message: '作成しました',
                timestamp: new Date().toString(),
                type: 'success',
              },
            }),
          );
          return _result.data;
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

  const deletePrivateZone = useCallback(
    async (id: number): Promise<boolean | void> => {
      setDeleteLoading(true);

      const credentials = await checkKeychain();

      if (credentials) {
        try {
          console.log('2');
          await axios.delete(
            `${origin}/privateZone/${id}?id=${credentials.id}`,
            headers(credentials.token),
          );

          dispatch(
            showBottomToast({
              data: {
                message: '削除しました',
                timestamp: new Date().toString(),
                type: 'success',
              },
            }),
          );
          setDeleteLoading(false);
          return true;
        } catch (e) {
          handleBasicApiErrorWithDispatch({e, dispatch});
        }
      } else {
        console.log('1');
        handleCredentialsError(dispatch);
      }
      setDeleteLoading(false);
    },
    [dispatch],
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
