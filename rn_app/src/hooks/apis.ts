import {useCallback} from 'react';

import {useCustomDispatch} from '~/hooks/stores';
import {Credentials} from '~/helpers/credentials';
import {checkKeychain} from '~/helpers/credentials';
import {
  handleBasicApiErrorWithDispatch,
  handleCredentialsError,
} from '~/helpers/errors';

export const useApis = () => {
  const dispatch = useCustomDispatch();

  const handleApi = useCallback(
    async (request: (credentials: Credentials) => any) => {
      const credentials = await checkKeychain();
      if (credentials) {
        try {
          const result = request(credentials);
          return result;
        } catch (e) {
          handleBasicApiErrorWithDispatch({e, dispatch});
        }
      } else {
        handleCredentialsError(dispatch);
      }
    },
    [dispatch],
  );

  return {handleApi};
};
