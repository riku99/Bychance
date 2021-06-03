import React, {useCallback, useMemo, useState} from 'react';
import {View, Switch} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '~/stores';
import {changeUserDisplayThunk} from '~/apis/users/changeUserDisplay';
import {useCustomDispatch} from '~/hooks/stores/dispatch';
import {ConfigList} from './List';
import {commonStyles} from './constants';

export const DisplayConfig = React.memo(() => {
  const userDisplay = useSelector((state: RootState) => {
    return state.userReducer.user!.display;
  });

  const dispatch = useCustomDispatch();

  const [switchForDisplay, setSwitchForDisplay] = useState(userDisplay);

  const onUserDisplaySwitchValueChange = useCallback(async () => {
    if (switchForDisplay) {
      setSwitchForDisplay(false);
      await dispatch(changeUserDisplayThunk(false));
    } else {
      setSwitchForDisplay(true);
      await dispatch(changeUserDisplayThunk(true));
    }
  }, [setSwitchForDisplay, switchForDisplay, dispatch]);

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
      },
    ];
  }, [switchForDisplay, onUserDisplaySwitchValueChange]);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.sectionContainer}>
        <ConfigList list={list} />
      </View>
    </View>
  );
});
