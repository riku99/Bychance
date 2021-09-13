import {useEffect} from 'react';
import BackgroundGeolocation, {
  Location,
} from 'react-native-background-geolocation';
import {useToast} from 'react-native-fast-toast';

import {useUpdateLocation, useIsDisplayedToOtherUsers} from '~/hooks/users';

export const useBackgroundGeolocation = () => {
  const {updateLocation} = useUpdateLocation();
  const {getIsDisplayedToOtherUsers} = useIsDisplayedToOtherUsers();
  const toast = useToast();

  useEffect(() => {
    BackgroundGeolocation.onLocation(
      async (location: Location) => {
        // sampleは正確な位置情報を待っている状態。デバイスのマップ上で徐々に動かしたりするときはsample状態でも反映させるべきだが手動でサーバに保存する時は基本的にいらない。現在前者である必要はないのでsampleは無視する
        // https://transistorsoft.github.io/react-native-background-geolocation/classes/backgroundgeolocation.html#onlocation
        if (!location.sample) {
          console.log('位置情報が更新されました');
          const {latitude, longitude} = location.coords;
          await updateLocation({lat: latitude, lng: longitude});
          getIsDisplayedToOtherUsers();
          if (location.extras?.manual) {
            toast?.show('更新しました', {type: 'success'});
          }
        }
      },
      (_error) => {
        console.log(_error);
      },
    );

    BackgroundGeolocation.ready(
      {
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10, // イベントが発生するのに必要な最低距離 本番でもっと距離大きくする
        stopTimeout: 1, // デバイスの動きが実際に止まってから Stationary になるまでの分数。この分数より前にデバイスの動きが検知されたら Moving のまま。
        debug: false,
        stopOnTerminate: false,
        startOnBoot: true,
        disableLocationAuthorizationAlert: true,
        locationAuthorizationAlert: {
          titleWhenOff: '位置情報がオフになっています',
          titleWhenNotEnabled: 'バックグラウンドで位置情報が利用できません',
          instructions:
            'バックグラウンドで位置情報に関連したサービスを利用するには端末の設定から「常に」を設定してください',
          cancelButton: 'キャンセル',
          settingsButton: '設定画面へ',
        },
        // logLevel: BackgroundGeolocation.LOG_LEVEL_OFF, 本番ではコメントはずす
      },
      (state) => {
        if (!state.enabled) {
          BackgroundGeolocation.start();
        }
      },
      (error) => {
        console.log(error);
      },
    );

    const cleanup = () => {
      BackgroundGeolocation.removeListeners();
    };
    return cleanup;
  }, [updateLocation, toast, getIsDisplayedToOtherUsers]);
};
