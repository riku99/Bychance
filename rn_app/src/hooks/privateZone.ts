import {useEffect, useState} from 'react';
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

export const useFetchPrivateZone = () => {
  const bottomToast = useToast();
  const dispatch = useCustomDispatch();

  const [result, setResult] = useState<PrivateZone[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
      setIsLoading(false);
    };

    _fetch();
  }, [dispatch, bottomToast]);

  return {
    result,
    isLoading,
    err,
  };
};
