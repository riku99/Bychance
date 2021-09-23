import {useCallback} from 'react';

import {useApikit} from './apikit';
import {postRequestToDeviceToken} from '~/apis/deviceToken';

export const useHandleDeviceToken = () => {
  const {handleApiError} = useApikit();

  const postDeviceToken = useCallback(
    async (deviceToken: string) => {
      try {
        await postRequestToDeviceToken(deviceToken);
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError],
  );

  return {
    postDeviceToken,
  };
};
