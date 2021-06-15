import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {RootStackScreen} from '../screens/Root';
import {Container as Auth} from './screens/Auth/Page';
import {useTalkRoomMessagesIo} from '~/hooks/socketio/talkRoomMessages';
import {useUserSelect} from '~/hooks/users/selector';
import {useLoginSelect} from '~/hooks/sessions/selector';
import {useSessionLoginProcess} from '~/hooks/sessions/login';
import {
  usePushNotificationReqest,
  useRegisterDeviceToken,
} from '~/hooks/pushNotification/setup';
import {useBackgroundGeolocation} from '~/hooks/geolocation';
import {useActiveRefresh} from '~/hooks/refresh';
import {useToast} from 'react-native-fast-toast';
import {RootState} from '~/stores';

const Root = () => {
  const [load, setLoad] = useState(true);
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

  // active時の更新処理
  useActiveRefresh({login, id});

  const bottomToastData = useSelector(
    (state: RootState) => state.bottomToastReducer.data,
  );

  const bottomToast = useToast();

  useEffect(() => {
    if (bottomToastData) {
      bottomToast?.show(bottomToastData.message, {
        type: bottomToastData.type,
        successIcon: <MIcon name="done" color="white" size={17} />,
        dangerIcon: <MIcon name="clear" color="white" size={17} />,
        icon: <MIcon name="priority-high" color="white" size={17} />,
        style: {
          width: bottomToastWidth,
        },
      });
    }
  }, [bottomToastData, bottomToast]);

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

const {width} = Dimensions.get('screen');

const bottomToastWidth = width * 0.9;

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
