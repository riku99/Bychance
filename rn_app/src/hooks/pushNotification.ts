import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';

import {createDeviceToken} from '~/thunks/deviceToken/createDeviceToken';
import {useCustomDispatch} from '~/hooks/stores';
import {RootNavigationProp} from '~/screens/Root';

// push通知の許可リクエスト
export const usePushNotificationReqest = ({login}: {login: boolean}) => {
  useEffect(() => {
    if (login) {
      async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
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
        dispatch(createDeviceToken({token}));
      };
      getDeviceToken();

      messaging().onTokenRefresh((token) =>
        dispatch(createDeviceToken({token})),
      );
    }
  }, [login, dispatch]);
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
