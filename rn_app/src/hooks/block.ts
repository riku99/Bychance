import {useCallback, useState} from 'react';
import {default as axios} from 'axios';
import {RNToasty} from 'react-native-toasty';
import {useSelector} from 'react-redux';

import {useApikit} from './apikit';
import {baseUrl} from '~/constants/url';

export const useCreateBlcok = () => {
  const {addBearer, checkKeychain, handleApiError} = useApikit();
  const [isLoading, setIsLoading] = useState(false);

  const block = useCallback(
    async ({blockTo}: {blockTo: string}) => {
      setIsLoading(true);
      try {
        const credentials = await checkKeychain();

        await axios.post(
          `${baseUrl}/users/block?id=${credentials?.id}`,
          {blockTo},
          addBearer(credentials?.token),
        );

        RNToasty.Show({
          title: 'ブロックしました',
          position: 'center',
        });
      } catch (e) {
        handleApiError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError, addBearer, checkKeychain],
  );

  return {
    block,
    isLoading,
  };
};
