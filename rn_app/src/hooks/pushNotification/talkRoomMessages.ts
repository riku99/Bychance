import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';

import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {RootNavigationProp} from '~/screens/Root';

type TalkRoomMessagesNotificationData = {
  type: 'talkRoomMessages';
  talkRoomId: string;
  partnerId: string;
};

export const useTalkRoomMessagesPushNotification = () => {
  const dispatch = useCustomDispatch();
  const navigate = useNavigation<
    RootNavigationProp<'Flashes' | 'TakeFlash' | 'Tab' | 'UserEditStack'>
  >();

  useEffect(() => {
    //backgroundで通知を受け取ってその通知をタップした時の処理;
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log('backgroundからアプリを開きました');
      console.log(remoteMessage);
      const {
        talkRoomId,
        partnerId,
      } = remoteMessage.data as TalkRoomMessagesNotificationData;

      navigate.push('TalkRoomStack', {
        screen: 'ChatRoom',
        params: {
          roomId: Number(talkRoomId),
          partnerId: partnerId,
        },
      });
    });

    // quit状態(アプリがbackgroundで動いてない場合やデバイスが起動してない場合)できた通知をタップした時の処理
    messaging()
      .getInitialNotification()
      .then(() => {
        console.log('quit状態からアプリが開かれました');
      });
  }, [dispatch, navigate]);
};
