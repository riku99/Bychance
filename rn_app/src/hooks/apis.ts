import {useCallback} from 'react';

import {useCustomDispatch} from '~/hooks/stores';
import {Credentials} from '~/helpers/credentials';
import {checkKeychain} from '~/helpers/credentials';
import {
  handleBasicApiErrorWithDispatch,
  handleCredentialsError,
} from '~/helpers/errors';
import {ReturnApiError} from '~/types';

export const useApis = () => {
  const dispatch = useCustomDispatch();

  const handleApi = useCallback(
    async <T>(
      request: (credentials: Credentials) => Promise<T>,
    ): Promise<T | ReturnApiError> => {
      const credentials = await checkKeychain();
      if (credentials) {
        try {
          const result = await request(credentials);
          return result;
        } catch (e) {
          const result = handleBasicApiErrorWithDispatch({e, dispatch});
          return result;
        }
      } else {
        handleCredentialsError(dispatch);
        return {errorType: 'loginError'};
      }
    },
    [dispatch],
  );

  return {handleApi};
};
