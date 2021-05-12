import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

import {useCustomDispatch} from '~/hooks/stores/dispatch';

export const useRegisterRecieveTalkRoomMessages = ({
  login,
}: {
  login: boolean;
}) => {
  const dispatch = useCustomDispatch();
  useEffect(() => {
    if (login) {
      //backgroundで通知を受け取ってその通知をタップした時の処理;
      messaging().onNotificationOpenedApp(async () => {
        console.log('backgroundからアプリを開きました');
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
