import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {receiveTalkRoomMessage} from '~/stores/talkRoomMessages';
import {ReceivedMessageData} from '~/stores/types';

export const useRegisterRecieveTalkRoomMessages = ({
  login,
}: {
  login: boolean;
}) => {
  const dispatch = useCustomDispatch();
  useEffect(() => {
    if (login) {
      //backgroundで通知を受け取った時の処理;
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        const data = remoteMessage.data as unknown;
        console.log(data);
        // dispatch(メッセージの反映)はsocketで行うが、socketがダメだった場合を考えてこっちでもdispatchする。ただ、今の状態ですると多分ダブるのでダブらないようにする
        dispatch(receiveTalkRoomMessage(data as ReceivedMessageData));
      });

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
