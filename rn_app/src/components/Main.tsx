import React from 'react';
import {View, StyleSheet} from 'react-native';
import FlashMessage from 'react-native-flash-message';

import {RootStackScreen} from '~/navigations/Root';
import {useTalkRoomMessagesIo} from '~/hooks/socketio';
import {usePushNotificationReqest} from '~/hooks/pushNotification';

export const Main = React.memo(() => {
  // socket周り
  useTalkRoomMessagesIo();

  // push通知周り
  usePushNotificationReqest();

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
