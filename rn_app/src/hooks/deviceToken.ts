import {useCallback} from 'react';

import {postRequestToDeviceToken} from '~/apis/deviceToken';

export const useHandleDeviceToken = () => {
  const postDeviceToken = useCallback(async (deviceToken: string) => {
    try {
      await postRequestToDeviceToken(deviceToken);
    } catch (e) {
      // handleApiError(e);
    }
  }, []);

  return {
    postDeviceToken,
  };
};
