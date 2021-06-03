import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View, Switch} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '~/stores';
import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {changeTalkRoomMessageReceiptThunk} from '~/apis/users/changeTalkRoomMessageReceipt';
import {ConfigList} from './List';
import {commonStyles} from './constants';

export const MessageConfig = React.memo(() => {
  const talkRoomMessageReceipt = useSelector(
    (state: RootState) => state.userReducer.user!.talkRoomMessageReceipt,
  );

  const [
    switchValueForMessageReceipt,
    setSwitchValueForMessageReceipt,
  ] = useState(talkRoomMessageReceipt);

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
    ];
  }, [switchValueForMessageReceipt, onMessageReceiptSwitchValueChange]);
  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <ConfigList list={list} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  sectionContainer: {
    marginTop: 30,
  },
  switch: {
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
  },
});
