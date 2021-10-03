import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

import {useHandleDeviceToken} from './deviceToken';

// push通知の許可リクエスト
export const usePushNotificationReqest = () => {
  useEffect(() => {
    async function requestUserPermission() {
      const authStatus = await messaging().hasPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (!enabled) {
        await messaging().requestPermission();
      }
    }
    requestUserPermission();
  }, []);
};

// push通知のためのデバイストークンをサーバーに登録する処理
export const useRegisterDeviceToken = () => {
  const {postDeviceToken} = useHandleDeviceToken();
  useEffect(() => {
    (async function () {
      const deviceToken = await messaging().getToken();
      console.log(deviceToken);
      postDeviceToken(deviceToken);
    })();
  }, [postDeviceToken]);

  useEffect(() => {
    // onTokenRefreshはactiveの時にしか呼ばれない。なのでactive時の処理の部分でもトークン更新を行っている
    const undebscribe = messaging().onTokenRefresh((token) => {
      postDeviceToken(token);
    });

    return undebscribe;
  }, [postDeviceToken]);
};

type TalkRoomMessagesNotificationData = {
  type: 'talkRoomMessages';
  talkRoomId: string;
  partnerId: string;
};
