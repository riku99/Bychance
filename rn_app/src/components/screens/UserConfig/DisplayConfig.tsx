import React, {useCallback, useMemo, useState} from 'react';
import {View, Switch, Text} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '~/stores';
import {changeUserDisplayThunk} from '~/apis/users/changeUserDisplay';
import {useCustomDispatch} from '~/hooks/stores';
import {ConfigList} from './List';
import {commonStyles} from './constants';
import {CustomPopupModal} from '~/components/utils/PopupModal';

export const DisplayConfig = React.memo(() => {
  const userDisplay = useSelector((state: RootState) => {
    return state.userReducer.user!.display;
  });

  const dispatch = useCustomDispatch();

  const [switchForDisplay, setSwitchForDisplay] = useState(userDisplay);
  const [
    showDisplayDescriptionModal,
    setShowDisplayDescriptionModal,
  ] = useState(false);

  const onUserDisplaySwitchValueChange = useCallback(
    async (v: boolean) => {
      setSwitchForDisplay(v);
      const result = await dispatch(changeUserDisplayThunk(v));
      if (!changeUserDisplayThunk.fulfilled.match(result)) {
        setSwitchForDisplay(!v);
      }
    },
    [setSwitchForDisplay, dispatch],
  );

  const list = useMemo(() => {
    return [
      {
        title: '他のユーザーに自分を表示',
        switch: (
          <Switch
            value={switchForDisplay}
            style={commonStyles.switch}
            onValueChange={onUserDisplaySwitchValueChange}
          />
        ),
        description: true,
        onItemPress: () => setShowDisplayDescriptionModal(true),
      },
    ];
  }, [switchForDisplay, onUserDisplaySwitchValueChange]);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
      <CustomPopupModal
        isVisible={showDisplayDescriptionModal}
        closeModal={() => setShowDisplayDescriptionModal(false)}>
        <View style={commonStyles.descriptionModal}>
          <Text
            style={{fontSize: 15, marginHorizontal: 10, marginVertical: 10}}>
            ONの場合、一定の範囲内にいる他のユーザーに対して自分が表示されます。
            {'\n'}OFFの場合は他のユーザーに表示されることはありません。
            {'\n'}※
            位置情報が削除される訳ではありません。削除したい場合はメニューの「位置情報」から行ってください。
          </Text>
        </View>
      </CustomPopupModal>
    </View>
  );
});
