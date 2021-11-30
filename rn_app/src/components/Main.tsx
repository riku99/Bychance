import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RootStackScreen} from '~/navigations/Root';
import {
  usePushNotificationReqest,
  useRegisterDeviceToken,
} from '~/hooks/pushNotification';
import {useBackgroundGeolocation} from '~/hooks/geolocation';
import {useSetupTalkRoomMessageSocket} from '~/hooks/talkRoomMessages';
import {useGetTalkRoomDataOnActive} from '~/hooks/talkRooms';
import {useGetIsDisplayedToOtherUsersOnActive} from '~/hooks/users';
import {
  useSetupApplyingGroupSocket,
  useAppliedGropusOnActive,
} from '~/hooks/applyingGroups';
import {useLoginData} from '~/hooks/sessions';
import {useSetupVideoCallingSocket} from '~/hooks/videoCalling';
import {GetCall} from '~/components/utils/GetCall';
import {useVideoCalling, useGettingCall} from '~/hooks/appState';

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
  // // アクティブになるたびにトークルーム更新とか
  useGetTalkRoomDataOnActive();
  // アクティブになるたびにisDisplayedToOtherUsersを更新
  useGetIsDisplayedToOtherUsersOnActive();
  // アクティブになるたびに申請されているグループの確認
  useAppliedGropusOnActive();

  const {gettingCall} = useGettingCall();
  const {videoCalling} = useVideoCalling();

  return (
    <View style={styles.container}>
      <RootStackScreen />
      {videoCalling && (
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'gray',
            position: 'absolute',
          }}
        />
      )}
      {gettingCall && <GetCall />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
