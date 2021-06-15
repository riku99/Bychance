import {useEffect, useState} from 'react';
import axios from 'axios';
import {useToast} from 'react-native-fast-toast';

import {checkKeychain} from '~/helpers/credentials';
import {origin} from '~/constants/origin';
import {headers} from '~/helpers/requestHeaders';
import {BasicAxiosError, PrivateZone} from '~/types';
import {useCustomDispatch} from './stores';
import {handleCredentialsError} from '~/helpers/errors';

export const useFetchPrivateZone = () => {
  const bottomToast = useToast();
  const dispatch = useCustomDispatch();

  const [result, setResult] = useState<PrivateZone[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const _fetch = async () => {
      console.log('fetchしました');
      const credentials = await checkKeychain();
      if (credentials) {
        try {
          const _result = await axios.get<PrivateZone[]>(
            `${origin}/privateZone?id=${credentials.id}`,
            headers(credentials.token),
          );
          setResult(_result.data);
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
          const err = e as BasicAxiosError;
          switch (err.response?.data.errorType) {
            case 'invalidError':
              bottomToast?.show(err.response.data.message, {type: 'danger'});
              return;
            case 'loginError':
              handleCredentialsError(dispatch);
              return;
          }
        }
      } else {
        setIsLoading(false);
        handleCredentialsError(dispatch);
      }
    };
    _fetch();
  }, [dispatch, bottomToast]);

  return {
    result,
    isLoading,
  };
};
