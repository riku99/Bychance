import React, {useCallback, useMemo, useState} from 'react';
import {View, Switch, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {PeepsModal} from '~/components/utils/PeepsModal';
import {ConfigList} from './List';
import {commonStyles} from './constants';
import {useDisplay} from '~/hooks/settings';
import {useIsDisplayedToOtherUsers} from '~/hooks/users';

const Men = require('~/assets/img/coffee-men.png');
const Women = require('~/assets/img/glassWomen.png');

export const DisplayConfig = React.memo(() => {
  const {currentDisplay, changeDisplay} = useDisplay();
  const {getIsDisplayedToOtherUsers} = useIsDisplayedToOtherUsers();

  const [switchForDisplay, setSwitchForDisplay] = useState(!!currentDisplay);
  const [
    showDisplayDescriptionModal,
    setShowDisplayDescriptionModal,
  ] = useState(false);

  const onUserDisplaySwitchValueChange = useCallback(
    async (v: boolean) => {
      setSwitchForDisplay(v);
      const result = await changeDisplay(v);

      getIsDisplayedToOtherUsers();

      if (!result) {
        setSwitchForDisplay(!v);
      }
    },
    [setSwitchForDisplay, changeDisplay, getIsDisplayedToOtherUsers],
  );

  const navigation = useNavigation();

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
      {
        title: 'プライベートゾーンの設定',
        onItemPress: () => {
          navigation.navigate('PrivateConfig', {goTo: 'zone'});
        },
      },
      {
        title: 'プライベートタイムの設定',
        onItemPress: () => {
          navigation.navigate('PrivateConfig', {goTo: 'time'});
        },
      },
    ];
  }, [switchForDisplay, onUserDisplaySwitchValueChange, navigation]);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
      <PeepsModal
        isVisible={showDisplayDescriptionModal}
        closeButtonPress={() => setShowDisplayDescriptionModal(false)}
        sources={[Men, Women]}>
        <Text style={{fontSize: 16}}>
          ONの場合、一定の範囲内にいる他のユーザーに対して自分が表示されます。
          {'\n'}OFFの場合、他のユーザーに表示されることはありません。
        </Text>
      </PeepsModal>
    </View>
  );
});
