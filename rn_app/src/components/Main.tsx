import React from 'react';
import {View, StyleSheet} from 'react-native';
import FlashMessage from 'react-native-flash-message';

import {RootStackScreen} from '~/navigations/Root';
import {useTalkRoomMessagesIo} from '~/hooks/socketio';

export const Main = React.memo(() => {
  // socket周り
  useTalkRoomMessagesIo();
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
