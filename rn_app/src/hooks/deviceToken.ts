import {useCallback} from 'react';
import {default as axios} from 'axios';

import {baseUrl} from '~/constants/url';
import {useApikit} from './apikit';

export const useHandleDeviceToken = () => {
  const {checkKeychain, addBearer, handleApiError} = useApikit();

  const postDeviceToken = useCallback(
    async (deviceToken: string) => {
      const credentials = await checkKeychain();

      try {
        await axios.post(
          `${baseUrl}/deviceToken?id=${credentials?.id}`,
          {token: deviceToken},
          addBearer(credentials?.token),
        );
      } catch (e) {
        handleApiError(e);
      }
    },
    [checkKeychain, addBearer, handleApiError],
  );

  return {
    postDeviceToken,
  };
};
