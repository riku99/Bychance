import {useEffect} from 'react';
import {AppState} from 'react-native';
import BackgroundGeolocation, {
  Location,
} from 'react-native-background-geolocation';
import {useCustomDispatch} from './stores';

import {updateLocationThunk, patchLocation} from '~/apis/users/updateLocation';
import {checkKeychain} from '~/helpers/credentials';

export const useBackgroundGeolocation = ({login}: {login: boolean}) => {
  const dispatch = useCustomDispatch();

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
            // 新たな位置情報をサーバーに保存
            const credentials = await checkKeychain();
            if (credentials) {
              patchLocation({lat: latitude, lng: longitude, credentials});
            }
          }
        }
      });

      BackgroundGeolocation.ready(
        {
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
          distanceFilter: 10, // イベントが発生するのに必要な最低距離
          stopTimeout: 1, // デバイスの動きが実際に止まってから Stationary になるまでの分数。この分数より前にデバイスの動きが検知されたら Moving のまま。
          debug: true,
          stopOnTerminate: false,
          startOnBoot: true,
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
  }, [login, dispatch]);
};

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
