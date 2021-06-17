import {useCallback, useEffect, useState} from 'react';
import axios from 'axios';

import {checkKeychain} from '~/helpers/credentials';
import {origin} from '~/constants/origin';
import {headers} from '~/helpers/requestHeaders';
import {PrivateTime} from '~/types';
import {
  handleCredentialsError,
  handleBasicApiErrorWithDispatch,
} from '~/helpers/errors';
import {showBottomToast} from '~/stores/bottomToast';
import {useCustomDispatch} from './stores';

export const usePrivateTime = () => {
  const dispatch = useCustomDispatch();

  const [postLoading, setPostLoading] = useState(false);

  const createPrivateTime = useCallback(
    async ({
      startHours,
      startMinutes,
      endHours,
      endMinutes,
    }: {
      startHours: number;
      startMinutes: number;
      endHours: number;
      endMinutes: number;
    }) => {
      setPostLoading(true);
      const credentials = await checkKeychain();
      if (credentials) {
        try {
          const apiResult = await axios.post<PrivateTime>(
            `${origin}/privateTime?id=${credentials.id}`,
            {startHours, startMinutes, endHours, endMinutes},
            headers(credentials.token),
          );
          setPostLoading(false);
          dispatch(
            showBottomToast({
              data: {
                message: '作成しました',
                type: 'success',
                timestamp: new Date().toString(),
              },
            }),
          );

          return apiResult.data;
        } catch (e) {
          handleBasicApiErrorWithDispatch({e, dispatch});
        }
      } else {
        handleCredentialsError(dispatch);
      }
      setPostLoading(false);
    },
    [dispatch],
  );

  return {
    postLoading,
    createPrivateTime,
  };
};
