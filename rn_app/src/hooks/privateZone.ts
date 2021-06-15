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

export const usePrivateZone = () => {
  const bottomToast = useToast();
  const dispatch = useCustomDispatch();

  const [result, setResult] = useState<PrivateZone[]>();
  const [fetchLoading, setfetchLoading] = useState<boolean>(true);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [err, setErr] = useState<any>();

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
          const _err = handleBasicApiErrorWithDispatch({e, dispatch});
          setErr(_err);
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
          return _result.data;
        } catch (e) {
          const _err = handleBasicApiErrorWithDispatch({e, dispatch});
          setErr(_err);
        }
      } else {
        handleCredentialsError(dispatch);
      }
      setPostLoading(false);
    },
    [dispatch],
  );

  return {
    result,
    fetchLoading,
    postLoading,
    err,
    createPrivateZone,
  };
};
