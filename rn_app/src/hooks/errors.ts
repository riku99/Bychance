import {useEffect, useCallback} from 'react';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import * as Keychain from 'react-native-keychain';
import {AxiosError} from 'axios';

import {RootState} from '~/stores';
import {logout, setLogin} from '~/stores/sessions';
import {resetError, setError} from '~/stores/errors';
import {useApikit} from './apikit';
import {ApiError} from '~/types/errors';
import {useCustomDispatch} from './stores';

export const useHandleErrors = () => {
  const {toast, dispatch} = useApikit();
  const error = useSelector((state: RootState) => state.errorsReducer.apiError);

  useEffect(() => {
    if (error) {
      switch (error.errorType) {
        case 'invalidError':
          toast?.show(error.message, {
            type: 'danger',
          });
          break;
        case 'loginError':
          Keychain.resetGenericPassword();
          Alert.alert('ログインが無効です', 'ログインし直してください', [
            {
              text: 'OK',
              onPress: () => {
                dispatch(setLogin(false));
              },
            },
          ]);
          break;
        default:
          toast?.show('何らかのエラーが発生しました', {
            type: 'danger',
          });
      }
      dispatch(resetError());
    }
  }, [error, toast, dispatch]);
};

export const useHandleApiErrors = () => {
  const dispatch = useCustomDispatch();

  const handleError = useCallback(
    (e: any) => {
      if (e && e.response) {
        const axiosError = e as AxiosError<ApiError>;
        if (axiosError.response?.data) {
          dispatch(setError(axiosError.response.data));
        } else {
          dispatch(setError({errorType: 'someError'}));
        }
      }
    },
    [dispatch],
  );

  return {
    handleError,
  };
};
