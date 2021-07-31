import {useEffect} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {useSelector} from 'react-redux';

import {useCustomDispatch} from './stores';
import {useHandleDeviceToken} from './deviceToken';
import {RootState} from '~/stores';
import {useRefreshUser} from '~/hooks/users';

export const useActive = () => {
  const id = useSelector((state: RootState) => state.userReducer.user?.id);

  const {postDeviceToken} = useHandleDeviceToken();

  const {refreshUser} = useRefreshUser();

  useEffect(() => {
    if (id) {
      const onActive = async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          refreshUser({userId: id});

          const deviceToken = await messaging().getToken();
          postDeviceToken(deviceToken);
        }
      };
      AppState.addEventListener('change', onActive); // background -> activeになったら更新処理。backgroundの場合位置情報はサーバに保存されるだけでクライアント側の状態は変化させないのでこれにより更新する

      return () => {
        AppState.removeEventListener('change', onActive);
      };
    }
  }, [id, refreshUser, postDeviceToken]);
};
