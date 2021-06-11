import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, AppState} from 'react-native';
import FlashMessage from 'react-native-flash-message';

import {RootStackScreen} from '../screens/Root';
import {Container as Auth} from './screens/Auth/Page';
import {updateLocationThunk, patchLocation} from '../apis/users/updateLocation';
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
  Location,
} from 'react-native-background-geolocation';
import {checkKeychain} from '~/helpers/credentials';

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

  useEffect(() => {
    if (login) {
      // BackgroundGeolocation内には大きく2つの状態が存在する。デバイスが「動いている」を表す Moving と「静止している」を表す Stationary である。そして位置情報システムは Moving の時のみ稼働する
      BackgroundGeolocation.ready(
        {
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
          distanceFilter: 10, // イベントが発生するのに必要な最低距離
          stopTimeout: 1, // デバイスの動きが実際に止まってから Stationary になるまでの分数。この分数より前にデバイスの動きが検知されたら Moving のまま。
          debug: true,
          stopOnTerminate: false,
          startOnBoot: true,
          // preventSuspend: true, iosがバックグラウンドでも実行できるようにするためのプロパティだが、Stationaryの時のためのもの。Movingの時はこれなしで動く。
          // logLevel: BackgroundGeolocation.LOG_LEVEL_OFF, 本番ではコメントはずす
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
    }
  }, [login]);

  useEffect(() => {
    if (login) {
      BackgroundGeolocation.onLocation(async (location: Location) => {
        // sampleは正確な位置情報を待っている状態。デバイスのマップ上で徐々に動かしたりするときはsample状態でも反映させるべきだが手動でサーバに保存する時は基本的にいらない。現在前者である必要はないのでsampleは無視する
        // https://transistorsoft.github.io/react-native-background-geolocation/classes/backgroundgeolocation.html#onlocation
        if (!location.sample) {
          console.log('位置情報が更新されました');
          console.log(location);
          const {latitude, longitude} = location.coords;
          if (AppState.currentState === 'active') {
            // dispatchでstoreを更新するのはactiveの時だけでいい
            dispatch(
              updateLocationThunk({
                lat: latitude,
                lng: longitude,
              }),
            );
          } else {
            // 更新情報をサーバーに保存
            const credentials = await checkKeychain();
            if (credentials) {
              patchLocation({lat: latitude, lng: longitude, credentials});
            }
          }
        }
      });

      // BackgroundGeolocation.onMotionChange((e) => {
      //   console.log('状態が変更しました');
      //   console.log(e.isMoving);
      // });
      // BackgroundGeolocation.onActivityChange((e) => {
      //   console.log('アクティビティに変更がありました');
      //   console.log(e);
      // });
    }
  }, [dispatch, login]);

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
