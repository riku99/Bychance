import React, {useCallback, useMemo, useState} from 'react';
import {View, Switch, Text} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '~/stores';
import {ConfigList} from './List';
import {commonStyles} from './constants';
import {CustomPopupModal} from '~/components/utils/PopupModal';
import {
  useChangeShowReceiveMessage,
  useChangeTalkRoomMessageReceipt,
} from '~/hooks/users';

export const MessageConfig = React.memo(() => {
  const talkRoomMessageReceipt = useSelector(
    (state: RootState) => state.userReducer.user!.talkRoomMessageReceipt,
  );

  const currentShowReceiveMessage = useSelector(
    (state: RootState) => state.userReducer!.user?.showReceiveMessage,
  );

  const [
    switchValueForMessageReceipt,
    setSwitchValueForMessageReceipt,
  ] = useState(talkRoomMessageReceipt);
  const [showMessageReceiptModal, setShowMessageReceiptModal] = useState(false);

  const [
    switchValueForShowRecieveMessage,
    setSwitchValueForShowRecieveMessage,
  ] = useState(currentShowReceiveMessage);
  const [
    showReceiveMessageDescription,
    setShowReceiveMessageDescription,
  ] = useState(false);

  const {changeShowReceiveMessage} = useChangeShowReceiveMessage();
  const {changeTalkRoomMessageReceipt} = useChangeTalkRoomMessageReceipt();

  const onMessageReceiptSwitchValueChange = useCallback(
    async (v: boolean) => {
      setSwitchValueForMessageReceipt(v);
      const result = await changeTalkRoomMessageReceipt({receipt: v});

      // 失敗したらスイッチを元に戻す
      if (!result) {
        setSwitchValueForMessageReceipt(!v);
      }
    },
    [changeTalkRoomMessageReceipt],
  );

  const onShowReceiveMessageSwitchValueChange = useCallback(
    async (v: boolean) => {
      setSwitchValueForShowRecieveMessage(v);
      const result = await changeShowReceiveMessage({showReceiveMessage: v});

      if (!result) {
        setSwitchValueForShowRecieveMessage(!v);
      }
    },
    [changeShowReceiveMessage],
  );

  const list = useMemo(() => {
    return [
      {
        title: 'メッセージを受け取る',
        switch: (
          <Switch
            style={commonStyles.switch}
            value={switchValueForMessageReceipt}
            onValueChange={(e) => onMessageReceiptSwitchValueChange(e)}
          />
        ),
        onItemPress: () => setShowMessageReceiptModal(true),
        description: true,
      },
      {
        title: 'メッセージの受け取りを知らせる',
        switch: (
          <Switch
            style={commonStyles.switch}
            value={switchValueForShowRecieveMessage}
            onValueChange={(e) => onShowReceiveMessageSwitchValueChange(e)}
          />
        ),
        description: true,
        onItemPress: () => setShowReceiveMessageDescription(true),
      },
    ];
  }, [
    switchValueForMessageReceipt,
    onMessageReceiptSwitchValueChange,
    switchValueForShowRecieveMessage,
    onShowReceiveMessageSwitchValueChange,
  ]);
  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
      <CustomPopupModal
        isVisible={showMessageReceiptModal}
        closeModal={() => setShowMessageReceiptModal(false)}>
        <View style={commonStyles.descriptionModal}>
          <Text style={commonStyles.descriptionText}>
            ONの場合、他のユーザーからメッセージを受け取ります。
            {'\n'}OFFの場合、他のユーザーからメッセージを受け取りません。
            {'\n'}
            なお、他のユーザーが「あなたがメッセージを受け取るかどうか」を知ることはありません。
          </Text>
        </View>
      </CustomPopupModal>
      <CustomPopupModal
        isVisible={showReceiveMessageDescription}
        closeModal={() => setShowReceiveMessageDescription(false)}>
        <View style={commonStyles.descriptionModal}>
          <Text style={commonStyles.descriptionText}>
            ONの場合、アプリ起動中（バックグラウンドは除く）にメッセージが他のユーザーから送られた場合に画面上部に表示されます。
            {'\n'}※ プッシュ通知とは別のものです
          </Text>
        </View>
      </CustomPopupModal>
    </View>
  );
});
