import React, {useCallback, useMemo, useState} from 'react';
import {View, Switch, Text} from 'react-native';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modal';

import {RootState} from '~/stores';
import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {changeTalkRoomMessageReceiptThunk} from '~/apis/users/changeTalkRoomMessageReceipt';
import {ConfigList} from './List';
import {commonStyles} from './constants';
import {CustomPopupModal} from '~/components/utils/PopupModal';

export const MessageConfig = React.memo(() => {
  const talkRoomMessageReceipt = useSelector(
    (state: RootState) => state.userReducer.user!.talkRoomMessageReceipt,
  );

  const [
    switchValueForMessageReceipt,
    setSwitchValueForMessageReceipt,
  ] = useState(talkRoomMessageReceipt);

  const [
    switchValueForShowRecieveMessage,
    setSwitchValueForShowRecieveMessage,
  ] = useState(true);
  const [
    showReceiveMessageDescription,
    setShowReceiveMessageDescription,
  ] = useState(false);

  const dispatch = useCustomDispatch();

  const onMessageReceiptSwitchValueChange = useCallback(() => {
    if (switchValueForMessageReceipt) {
      setSwitchValueForMessageReceipt(false);
      dispatch(changeTalkRoomMessageReceiptThunk({receipt: false}));
    } else {
      setSwitchValueForMessageReceipt(true);
      dispatch(changeTalkRoomMessageReceiptThunk({receipt: true}));
    }
  }, [dispatch, switchValueForMessageReceipt]);

  const list = useMemo(() => {
    return [
      {
        title: 'メッセージを受け取る',
        switch: (
          <Switch
            style={commonStyles.switch}
            value={switchValueForMessageReceipt}
            onValueChange={onMessageReceiptSwitchValueChange}
          />
        ),
      },
      {
        title: 'メッセージの受け取りを知らせる',
        switch: (
          <Switch
            style={commonStyles.switch}
            value={switchValueForShowRecieveMessage}
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
  ]);
  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
      <CustomPopupModal
        isVisible={showReceiveMessageDescription}
        closeModal={() => setShowReceiveMessageDescription(false)}>
        <View style={commonStyles.descriptionModal}>
          <Text
            style={{fontSize: 18, marginHorizontal: 10, marginVertical: 10}}>
            ONの場合、アプリ起動中（バックグラウンドは除く）にメッセージが他のユーザーから送られた場合に画面上部に表示されます。
          </Text>
        </View>
      </CustomPopupModal>
    </View>
  );
});
