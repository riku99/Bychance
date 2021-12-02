import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {requestPushNotification} from '~/helpers/pushNotification';
import {useHandleDeviceToken} from './deviceToken';

export const usePushNotificationReqest = () => {
  useEffect(() => {
    (async function () {
      await requestPushNotification();
    })();
  }, []);
};

// push通知のためのデバイストークンをサーバーに登録する処理
export const useRegisterDeviceToken = () => {
  const {postDeviceToken} = useHandleDeviceToken();
  useEffect(() => {
    (async function () {
      const deviceToken = await messaging().getToken();
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
