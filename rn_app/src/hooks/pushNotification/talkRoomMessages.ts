import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

import {useCustomDispatch} from '~/hooks/stores/dispatch';

type TalkRoomMessagesNotificationData = {
  type: 'talkRoomMessages';
  talkRoomId: string;
};

export const useTalkRoomMessagesPushNotification = ({
  login,
}: {
  login: boolean;
}) => {
  const dispatch = useCustomDispatch();
  useEffect(() => {
    if (login) {
      //backgroundで通知を受け取ってその通知をタップした時の処理;
      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log('backgroundからアプリを開きました');
        console.log(remoteMessage);
        const {
          talkRoomId,
        } = remoteMessage.data as TalkRoomMessagesNotificationData;

        // ここでトークルームにナビゲーションする
      });

      // quit状態(アプリがbackgroundで動いてない場合やデバイスが起動してない場合)できた通知をタップした時の処理
      messaging()
        .getInitialNotification()
        .then(() => {
          console.log('quit状態からアプリが開かれました');
        });
    }
  }, [login, dispatch]);
};
