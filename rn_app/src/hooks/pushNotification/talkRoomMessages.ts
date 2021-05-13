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
  const navigation = useNavigation<
    RootNavigationProp<'Flashes' | 'TakeFlash' | 'Tab' | 'UserEditStack'>
  >();

  useEffect(() => {
    //backgroundで通知を受け取ってその通知をタップした時の処理;
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      const {
        talkRoomId,
        partnerId,
      } = remoteMessage.data as TalkRoomMessagesNotificationData;

      // .push ではなく .navigate にすることで既にrouteに存在するすスタックを探す。そのため、既にトークルームが開かれている場合2重になることがない。pushだと新しいスタックが追加されるので2重になってしまう
      navigation.navigate('TalkRoomStack', {
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
  }, [dispatch, navigation]);
};
