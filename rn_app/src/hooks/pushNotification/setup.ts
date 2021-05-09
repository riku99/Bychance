import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

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
  useEffect(() => {
    if (login) {
      const getDeviceToken = async () => {
        const devicetoken = await messaging().getToken();
        console.log('これがトークンです: ' + devicetoken);
      };
      getDeviceToken();
    }
  }, [login]);
};
