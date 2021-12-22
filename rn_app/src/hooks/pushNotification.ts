import {useCallback, useEffect} from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {requestPushNotification} from '~/helpers/pushNotification';
import {useNavigation} from '@react-navigation/native';
import {PushNotificationData} from '~/types';
import {postRequestToDeviceToken} from '~/apis/deviceToken';
import {useGettingCall} from '~/hooks/appState';
import {useVideoCallingState} from '~/hooks/videoCalling';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const usePushNotificationReqest = () => {
  useEffect(() => {
    (async function () {
      await requestPushNotification();
    })();
  }, []);
};

const deviceTokenKey = 'deviceToken';
// push通知のためのデバイストークンをサーバーに登録する処理
export const useRegisterDeviceToken = () => {
  useEffect(() => {
    (async function () {
      try {
        const deviceToken = await messaging().getToken();
        const storageDeviceToken = await AsyncStorage.getItem(deviceTokenKey);
        if (!storageDeviceToken || deviceToken !== storageDeviceToken) {
          await postRequestToDeviceToken({
            newToken: deviceToken,
            oldToken: storageDeviceToken ? storageDeviceToken : undefined,
          });
          await AsyncStorage.setItem(deviceTokenKey, deviceToken);
        }
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    // onTokenRefreshはactiveの時にしか呼ばれない。なのでactive時の処理の部分でもトークン更新を行っている
    const undebscribe = messaging().onTokenRefresh(async (token) => {
      const storageDeviceToken = await AsyncStorage.getItem(deviceTokenKey);
      try {
        await postRequestToDeviceToken({
          newToken: token,
          oldToken: storageDeviceToken ? storageDeviceToken : undefined,
        });
      } catch (e) {}
    });

    return undebscribe;
  }, []);
};

export const usePushNotificationHandler = () => {
  const navigation = useNavigation();
  const {setGettingCall} = useGettingCall();
  const {setVideoCallingState} = useVideoCallingState();

  // backgroundから開いた場合とquitから開いた場合の共通処理
  const onOpened = useCallback(
    (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
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

      if (data.type === 'videoCalling') {
        setGettingCall(true);
        const {type, ...d} = data; // eslint-disable-line
        setVideoCallingState({
          channelName: data.channelName,
          token: data.token,
          uid: Number(data.intUid),
          callHistoryId: Number(data.callHistoryId),
          role: 'sub',
          publisher: JSON.parse(data.publisher),
        });
      }
    },
    [navigation, setGettingCall, setVideoCallingState],
  );

  useEffect(() => {
    //backgroundで通知を受け取ってその通知をタップした時の処理;
    const unsubscribe = messaging().onNotificationOpenedApp(
      async (remoteMessage) => {
        onOpened(remoteMessage);
      },
    );

    // quit状態(アプリがbackgroundで動いてない場合やデバイスが起動してない場合)できた通知をタップした時の処理
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          onOpened(remoteMessage);
        }
      });

    return unsubscribe;
  }, [onOpened]);
};
