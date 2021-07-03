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
          console.log(request);
          const result = await request(credentials);
          console.log(result);
          return result;
        } catch (e) {
          console.log(e);
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
