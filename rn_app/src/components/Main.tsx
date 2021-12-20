import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RootStackScreen} from '~/navigations/Root';
import {
  usePushNotificationReqest,
  useRegisterDeviceToken,
} from '~/hooks/pushNotification';
import {useBackgroundGeolocation} from '~/hooks/geolocation';
import {useSetupTalkRoomMessageSocket} from '~/hooks/talkRoomMessages';
import {useSetupApplyingGroupSocket} from '~/hooks/applyingGroups';
import {useLoginData} from '~/hooks/sessions';
import {useSetupVideoCallingSocket} from '~/hooks/videoCalling';
import {GetiingCall} from '~/components/utils/GetiingCall';
import {useVideoCalling, useGettingCall} from '~/hooks/appState';
import {VideoCalling} from '~/components/screens/VideoCalling';
import {useActiveData} from '~/hooks/active';

export const Main = React.memo(() => {
  // ログインデータの取得
  useLoginData();
  // socket周り
  useSetupTalkRoomMessageSocket();
  useSetupApplyingGroupSocket();
  useSetupVideoCallingSocket();
  // push通知周り
  usePushNotificationReqest();
  useRegisterDeviceToken();
  // 位置情報周り
  useBackgroundGeolocation();
  // active時の処理
  useActiveData();

  const {gettingCall} = useGettingCall();
  const {videoCalling} = useVideoCalling();

  return (
    <View style={styles.container}>
      <RootStackScreen />
      {videoCalling && <VideoCalling />}
      {gettingCall && <GetiingCall />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
