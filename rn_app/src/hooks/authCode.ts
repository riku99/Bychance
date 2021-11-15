import {useCallback} from 'react';

import {
  postRequestToUserAuthCode,
  getRequestToUserAuthCode,
} from '~/apis/authCode';
import {useApikit} from './apikit';

export const useCreateAuthCodeAndSendEmail = () => {
  const {handleApiError} = useApikit();

  const createAuthCodeAndSendEmail = useCallback(
    async (email: string) => {
      try {
        await postRequestToUserAuthCode(email);
        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError],
  );

  return {
    createAuthCodeAndSendEmail,
  };
};

export const useVerifyAuthCode = () => {
  const {handleApiError} = useApikit();
  const verifyAuthCode = useCallback(
    async (code: string) => {
      try {
        await getRequestToUserAuthCode(code);
        return true;
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError],
  );

  return {
    verifyAuthCode,
  };
};
