import React, {useCallback, useMemo, useState} from 'react';
import {View, Switch, Text} from 'react-native';
import {PeepsModal} from '~/components/utils/PeepsModal';
import {ConfigList} from './List';
import {commonStyles} from './constants';
import {
  useTalkRoomMessageReceipt,
  useShowReceiveMessage,
} from '~/hooks/settings';

const W = require('~/assets/img/glassWomen.png');
const E = require('~/assets/img/eye-ojisan.png');
const K = require('~/assets/img/kuma-ojisan.png');

export const MessageConfig = React.memo(() => {
  const {
    currentTalkRoomMessageReceipt,
    changeTalkRoomMessageReceipt,
  } = useTalkRoomMessageReceipt();
  const {
    changeShowReceiveMessage,
    currentShowReceiveMessage,
  } = useShowReceiveMessage();

  const [
    switchValueForMessageReceipt,
    setSwitchValueForMessageReceipt,
  ] = useState(!!currentTalkRoomMessageReceipt);
  const [showMessageReceiptModal, setShowMessageReceiptModal] = useState(false);

  const [
    switchValueForShowRecieveMessage,
    setSwitchValueForShowRecieveMessage,
  ] = useState(currentShowReceiveMessage);
  const [
    showReceiveMessageDescription,
    setShowReceiveMessageDescription,
  ] = useState(false);

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

      <PeepsModal
        isVisible={showMessageReceiptModal}
        closeButtonPress={() => setShowMessageReceiptModal(false)}
        sources={[E, W]}>
        <Text style={{fontSize: 16}}>
          ONの場合、他のユーザーからメッセージを受け取ります。
          {'\n'}
          {'\n'}
          OFFの場合、他のユーザーからメッセージを受け取りません。
          {'\n'}
          {'\n'}
          他のユーザーが「あなたがメッセージを受け取るかどうか」を知ることはありません。
        </Text>
      </PeepsModal>

      <PeepsModal
        isVisible={showReceiveMessageDescription}
        closeButtonPress={() => setShowReceiveMessageDescription(false)}
        sources={[K]}>
        <Text style={{fontSize: 16}}>
          ONの場合、アプリ起動中（バックグラウンドは除く）にメッセージが他のユーザーから送られた場合に画面上部に表示されます。
          {'\n'}
          {'\n'}※ プッシュ通知とは別のものです
        </Text>
      </PeepsModal>
    </View>
  );
});
