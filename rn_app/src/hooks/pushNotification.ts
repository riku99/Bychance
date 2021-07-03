import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';

import {useCustomDispatch} from '~/hooks/stores';
import {RootNavigationProp} from '~/navigations/Root';
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
    // onTokenRefreshはactiveの時にしか呼ばれない。
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

export const useTalkRoomMessagesPushNotification = () => {
  const dispatch = useCustomDispatch();
  const navigation = useNavigation<
    RootNavigationProp<'Flashes' | 'TakeFlash' | 'Tab' | 'UserEditStack'>
  >();

  // FIX: ログアウト時にはクリーンアップする
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
      .then((remoteMessage) => {
        if (remoteMessage) {
          const {
            talkRoomId,
            partnerId,
          } = remoteMessage.data as TalkRoomMessagesNotificationData;

          navigation.navigate('TalkRoomStack', {
            screen: 'ChatRoom',
            params: {
              roomId: Number(talkRoomId),
              partnerId: partnerId,
            },
          });
        }
      });
  }, [dispatch, navigation]);
};
