import {useEffect} from 'react';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import * as Keychain from 'react-native-keychain';

import {RootState} from '~/stores';
import {logout} from '~/stores/sessions';
import {resetError} from '~/stores/errors';
import {useApikit} from './apikit';

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
                dispatch(logout());
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
