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
import {GetiingCall} from '~/components/utils/GetiingCall';
import {useVideoCalling, useGettingCall} from '~/hooks/appState';
import {VideoCalling} from '~/components/screens/VideoCalling';
import {useVideoCallingState} from '~/hooks/videoCalling';

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
  const {videoCallingState} = useVideoCallingState();

  return (
    <View style={styles.container}>
      <RootStackScreen />
      {videoCalling &&
        videoCallingState.channelName &&
        videoCallingState.token &&
        videoCallingState.uid && (
          <VideoCalling
            channelName={videoCallingState.channelName}
            uid={videoCallingState.uid}
            token={videoCallingState.token}
          />
        )}
      {gettingCall && <GetiingCall />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
