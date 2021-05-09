import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

import {createDeviceToken} from '~/apis/deviceToken/createDeviceToken';
import {useCustomDispatch} from '~/hooks/stores/dispatch';

// push通知のリクエスト
export const usePushNotificationReqest = ({login}: {login: boolean}) => {
  useEffect(() => {
    if (login) {
      async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      }
      requestUserPermission();
    }
  }, [login]);
};

// push通知のためのデバイストークンをサーバーに登録する処理
export const useRegisterDeviceToken = ({login}: {login: boolean}) => {
  const dispatch = useCustomDispatch();
  useEffect(() => {
    if (login) {
      const getDeviceToken = async () => {
        const token = await messaging().getToken();
        console.log('token: ' + token);
        dispatch(createDeviceToken({token}));
      };
      getDeviceToken();
    }
  }, [login, dispatch]);
};
