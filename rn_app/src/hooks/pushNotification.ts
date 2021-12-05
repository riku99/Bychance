import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {requestPushNotification} from '~/helpers/pushNotification';
import {useHandleDeviceToken} from './deviceToken';
import {useNavigation} from '@react-navigation/native';
import {PushNotificationData} from '~/types';
import {RootNavigationProp} from '~/navigations/Root';
import {useCustomDispatch} from './stores';

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

export const usePushNotificationHandler = () => {
  const dispatch = useCustomDispatch();
  const navigation = useNavigation<
    RootNavigationProp<'Flashes' | 'TakeFlash' | 'Tab' | 'UserEditStack'>
  >();

  useEffect(() => {
    //backgroundで通知を受け取ってその通知をタップした時の処理;
    const unsubscribe = messaging().onNotificationOpenedApp(
      async (remoteMessage) => {
        const data = remoteMessage.data as PushNotificationData;
        if (data.type === 'talkRoomMessages') {
          const {talkRoomId, partnerId} = data;
          // .push ではなく .navigate にすることで既にrouteに存在するすスタックを探す。そのため、既にトークルームが開かれている場合2重になることがない。pushだと新しいスタックが追加されるので2重になってしまう
          navigation.navigate('TalkRoomStack', {
            screen: 'TalkRoom',
            params: {
              talkRoomId: Number(talkRoomId),
              partner: {
                id: partnerId,
              },
            },
          });
        }
      },
    );

    // quit状態(アプリがbackgroundで動いてない場合やデバイスが起動してない場合)できた通知をタップした時の処理
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        const data = remoteMessage?.data as PushNotificationData;
        if (data && data.type === 'talkRoomMessages') {
          const {talkRoomId, partnerId} = data;

          navigation.navigate('TalkRoomStack', {
            screen: 'TalkRoom',
            params: {
              talkRoomId: Number(talkRoomId),
              partner: {
                id: partnerId,
              },
            },
          });
        }
      });

    return unsubscribe;
  }, [dispatch, navigation]);
};
