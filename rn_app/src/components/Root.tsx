import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, AppState, AppStateStatus} from 'react-native';
import FlashMessage from 'react-native-flash-message';

import {RootStackScreen} from '../screens/Root';
import {Container as Auth} from './screens/Auth/Page';
import {updateLocationThunk} from '../apis/users/updateLocation';
// import {getCurrentPosition} from '../helpers/geolocation/getCurrentPosition';
import {useTalkRoomMessagesIo} from '~/hooks/socketio/talkRoomMessages';
import {useUserSelect} from '~/hooks/users/selector';
import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {useLoginSelect} from '~/hooks/sessions/selector';
import {useSessionLoginProcess} from '~/hooks/sessions/login';
import {
  usePushNotificationReqest,
  useRegisterDeviceToken,
} from '~/hooks/pushNotification/setup';
import {refreshUserThunk} from '~/apis/users/refreshUser';
import BackgroundGeolocation, {
  State,
  Config,
  Location,
  LocationError,
  Geofence,
  GeofenceEvent,
  GeofencesChangeEvent,
  HeartbeatEvent,
  HttpEvent,
  MotionActivityEvent,
  MotionChangeEvent,
  ProviderChangeEvent,
  ConnectivityChangeEvent,
} from 'react-native-background-geolocation';

const Root = () => {
  const [load, setLoad] = useState(true);
  const dispatch = useCustomDispatch();
  const login = useLoginSelect();
  const id = useUserSelect()?.id;

  const onEndSessionLogin = useCallback(() => setLoad(false), []);
  useSessionLoginProcess({endSessionLogin: onEndSessionLogin});

  // 位置情報取得のためのeffect。あとでカスタムフックにまとめる
  // useEffect(() => {
  //   if (login) {
  //     const _handleAppStateChange = async (nextAppState: AppStateStatus) => {
  //       if (nextAppState === 'active') {
  //         if (id) {
  //           dispatch(refreshUserThunk({userId: id}));
  //         }
  //         const position = await getCurrentPosition();
  //         dispatch(
  //           updateLocationThunk({
  //             lat: position ? position.coords.latitude : null,
  //             lng: position ? position.coords.longitude : null,
  //           }),
  //         );
  //       }
  //     };

  //     AppState.addEventListener('change', _handleAppStateChange);
  //     return () => {
  //       AppState.removeEventListener('change', _handleAppStateChange);
  //     };
  //   }
  // }, [dispatch, login, id]);

  // socket周り
  useTalkRoomMessagesIo({id});

  // push通知周り
  usePushNotificationReqest({login});
  useRegisterDeviceToken({login});

  const onLocation = (location: Location) => {
    console.log('hey');
    console.log(location);
  };

  useEffect(() => {
    BackgroundGeolocation.onLocation(onLocation);

    BackgroundGeolocation.ready(
      {
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        stopTimeout: 1,
        debug: true,
        stopOnTerminate: false,
        startOnBoot: true,
        // url: これで位置更新のたびにサーバーにアクセスできそう
        // headers: これでヘッダーつけれそう
        // params: 必要ならこれでpramsつけれそう
      },
      (state) => {
        console.log('設定、準備完了?: ' + state.enabled);

        if (!state.enabled) {
          console.log('トラッキングスタート');
          BackgroundGeolocation.start(() => {
            console.log('スタートしました');
          });
        }
      },
    );

    const cleanup = () => {
      BackgroundGeolocation.removeListeners();
    };
    return cleanup;
  }, []);

  if (load) {
    return null;
  }

  if (login) {
    return (
      <View style={styles.container}>
        <RootStackScreen />
        <FlashMessage position="top" />
      </View>
    );
  } else {
    return <Auth />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 30,
    borderRadius: 30,
    backgroundColor: '#2089dc',
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  infoText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  invalid: {
    position: 'absolute',
    top: 80,
    zIndex: 10,
    alignSelf: 'center',
  },
  invalidText: {
    color: 'red',
  },
});

export default Root;
