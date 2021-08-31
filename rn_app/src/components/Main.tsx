import React from 'react';
import {View, StyleSheet} from 'react-native';
import FlashMessage from 'react-native-flash-message';

import {RootStackScreen} from '~/navigations/Root';
import {
  usePushNotificationReqest,
  useRegisterDeviceToken,
} from '~/hooks/pushNotification';
import {useBackgroundGeolocation} from '~/hooks/geolocation';
import {useHandleErrors} from '~/hooks/errors';
import {useSetupTalkRoomMessageSocket} from '~/hooks/talkRoomMessages';
import {useGetTalkRoomData} from '~/hooks/talkRooms';

export const Main = React.memo(() => {
  // socket周り
  // useTalkRoomMessagesIo();
  useSetupTalkRoomMessageSocket();

  // push通知周り
  usePushNotificationReqest();
  useRegisterDeviceToken();

  // アクティブになった時の処理
  // useActive();

  // 位置情報周り
  useBackgroundGeolocation();

  // エラーをdispatchしたときの処理
  useHandleErrors();

  // アクティブになるたびにトークルーム更新とか
  useGetTalkRoomData();

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
