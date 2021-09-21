import React, {useMemo, useState} from 'react';
import {View, StyleSheet, Switch} from 'react-native';

import {ConfigList} from './List';
import {commonStyles} from './constants';
import {useGroupsApplicationEnabled} from '~/hooks/settings';
import {useGroupBadge} from '~/hooks/appState';

const GroupsApplicationEnabledSwitch = () => {
  const {
    groupsApplicationEnabled,
    changeGroupsApplicationEnabled,
  } = useGroupsApplicationEnabled();
  const {setGroupBadge} = useGroupBadge();
  const [switchValue, setSwitchValue] = useState(groupsApplicationEnabled);
  const onValueChange = async (v: boolean) => {
    setSwitchValue(v);
    const result = await changeGroupsApplicationEnabled(v);

    if (!result) {
      setSwitchValue(!v);
    }

    if (result && !v) {
      setGroupBadge(false);
    }
  };

  return (
    <Switch
      style={commonStyles.switch}
      value={switchValue}
      onValueChange={onValueChange}
    />
  );
};

export const GroupConfig = () => {
  const list = useMemo(() => {
    return [
      {
        title: 'グループ申請を受け取る',
        switch: <GroupsApplicationEnabledSwitch />,
      },
    ];
  }, []);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {},
});
