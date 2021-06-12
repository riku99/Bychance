import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, AppState} from 'react-native';
import FlashMessage from 'react-native-flash-message';

import {RootStackScreen} from '../screens/Root';
import {Container as Auth} from './screens/Auth/Page';
import {useTalkRoomMessagesIo} from '~/hooks/socketio/talkRoomMessages';
import {useUserSelect} from '~/hooks/users/selector';
import {useCustomDispatch} from '~/hooks/stores';
import {useLoginSelect} from '~/hooks/sessions/selector';
import {useSessionLoginProcess} from '~/hooks/sessions/login';
import {
  usePushNotificationReqest,
  useRegisterDeviceToken,
} from '~/hooks/pushNotification/setup';
import {refreshUserThunk} from '~/apis/users/refreshUser';
import {useBackgroundGeolocation} from '~/hooks/geolocation';

const Root = () => {
  const [load, setLoad] = useState(true);
  const dispatch = useCustomDispatch();
  const login = useLoginSelect();
  const id = useUserSelect()?.id;

  const onEndSessionLogin = useCallback(() => setLoad(false), []);
  useSessionLoginProcess({endSessionLogin: onEndSessionLogin});

  // socket周り
  useTalkRoomMessagesIo({id});

  // push通知周り
  usePushNotificationReqest({login});
  useRegisterDeviceToken({login});

  // 位置情報周り
  useBackgroundGeolocation({login});

  useEffect(() => {
    if (login && id) {
      const _refresh = () => {
        if (AppState.currentState === 'active') {
          dispatch(refreshUserThunk({userId: id}));
        }
      };
      AppState.addEventListener('change', _refresh); // background -> activeになったら更新処理。backgroundの場合位置情報はサーバに保存されるだけでクライアント側の状態は変化させないのでこれにより更新する

      return () => {
        AppState.removeEventListener('change', _refresh);
      };
    }
  }, [login, id, dispatch]);

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
