import {useEffect, useCallback} from 'react';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import * as Keychain from 'react-native-keychain';
import {AxiosError} from 'axios';

import {RootState} from '~/stores';
import {resetError, setError} from '~/stores/errors';
import {useApikit} from './apikit';
import {ApiError} from '~/types/errors';
import {useCustomDispatch} from './stores';
import {useResetDispatch} from './stores';

export const useHandleErrors = () => {
  const {toast, dispatch} = useApikit();
  const error = useSelector((state: RootState) => state.errorsReducer.apiError);
  const {resetDispatch} = useResetDispatch();

  useEffect(() => {
    if (error) {
      console.log('fire');
      switch (error.errorType) {
        case 'invalidError':
          if (error.alertDialog) {
            Alert.alert('エラーが発生しました', error.message, [
              {
                text: 'OK',
              },
            ]);
          } else {
            toast?.show(error.message, {
              type: 'danger',
            });
          }
          break;
        case 'loginError':
          Keychain.resetGenericPassword();
          Alert.alert('ログインが無効です', 'ログインし直してください', [
            {
              text: 'OK',
              onPress: () => {
                resetDispatch();
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
  }, [error, toast, resetDispatch, dispatch]);
};

export const useHandleApiErrors = () => {
  const dispatch = useCustomDispatch();

  const handleApiError = useCallback(
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
    handleApiError,
  };
};
