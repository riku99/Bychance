import React from 'react';
import {View, StyleSheet} from 'react-native';
import FlashMessage from 'react-native-flash-message';

import {RootStackScreen} from '~/navigations/Root';
import {useTalkRoomMessagesIo} from '~/hooks/socketio';
import {
  usePushNotificationReqest,
  useRegisterDeviceToken,
} from '~/hooks/pushNotification';
import {useActive} from '~/hooks/active';
import {useBackgroundGeolocation} from '~/hooks/geolocation';
import {useSetupBottomToast} from '~/hooks/bottomToast';

export const Main = React.memo(() => {
  // socket周り
  useTalkRoomMessagesIo();

  // push通知周り
  usePushNotificationReqest();
  useRegisterDeviceToken();

  // アクティブになった時の処理
  useActive();

  // 位置情報周り
  useBackgroundGeolocation();

  // 下から出てくるトーストのセットアップ
  useSetupBottomToast();

  return (
    <View style={styles.container}>
      <RootStackScreen />
      <FlashMessage position="top" />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
