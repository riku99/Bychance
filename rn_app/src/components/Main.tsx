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

export const Main = React.memo(() => {
  // socket周り
  useTalkRoomMessagesIo();

  // push通知周り
  usePushNotificationReqest();
  useRegisterDeviceToken();

  // アクティブになった時の処理
  useActive();

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
