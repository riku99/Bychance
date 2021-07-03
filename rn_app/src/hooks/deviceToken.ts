import {useCallback} from 'react';
import {default as axios} from 'axios';

import {headers} from '~/helpers/requestHeaders';
import {origin} from '~/constants/origin';

import {useApis} from './apis';

export const useHandleDeviceToken = () => {
  const {handleApi} = useApis();

  const postDeviceToken = useCallback(
    async (deviceToken: string) => {
      handleApi(async (credentials) => {
        await axios.post(
          `${origin}/deviceToken?id=${credentials.id}`,
          {token: deviceToken},
          headers(credentials.token),
        );
      });
    },
    [handleApi],
  );

  return {
    postDeviceToken,
  };
};
