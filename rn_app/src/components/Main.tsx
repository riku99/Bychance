import React from 'react';
import {View, StyleSheet} from 'react-native';

import {RootStackScreen} from '~/navigations/Root';
import {
  usePushNotificationReqest,
  useRegisterDeviceToken,
} from '~/hooks/pushNotification';
import {useBackgroundGeolocation} from '~/hooks/geolocation';
import {useHandleErrors} from '~/hooks/errors';
import {useSetupTalkRoomMessageSocket} from '~/hooks/talkRoomMessages';
import {useGetTalkRoomData} from '~/hooks/talkRooms';
import {useGetIsDisplayedToOtherUsersOnActive} from '~/hooks/users';
import {
  useSetupApplyingGroupSocket,
  useAppliedGropusOnActive,
} from '~/hooks/applyingGroups';

export const Main = React.memo(() => {
  // socket周り
  useSetupTalkRoomMessageSocket();
  useSetupApplyingGroupSocket();
  // push通知周り
  usePushNotificationReqest();
  useRegisterDeviceToken();
  // 位置情報周り
  useBackgroundGeolocation();
  // // アクティブになるたびにトークルーム更新とか
  useGetTalkRoomData();
  // アクティブになるたびにisDisplayedToOtherUsersを更新
  useGetIsDisplayedToOtherUsersOnActive();
  // アクティブになるたびに申請されているグループの確認
  useAppliedGropusOnActive();

  return (
    <View style={styles.container}>
      <RootStackScreen />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
