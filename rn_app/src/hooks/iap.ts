import {IAPContext} from '~/providers/IAPProvider';
import {useContext, useCallback} from 'react';
import {PostRequestToIapVerify} from '~/apis/iap/types';
import {postRequestToIapVerify} from '~/apis/iap';
import {useApikit} from './apikit';

export const useIap = () => useContext(IAPContext);

export const useReceiptVerify = () => {
  const {handleApiError} = useApikit();
  const verifyReciept = useCallback(
    async (payload: PostRequestToIapVerify['payload']) => {
      try {
        await postRequestToIapVerify(payload);
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError],
  );

  return {
    verifyReciept,
  };
};
