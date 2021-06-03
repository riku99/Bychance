import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View, Switch} from 'react-native';
import {ListItem} from 'react-native-elements';
import {useSelector} from 'react-redux';

import {RootState} from '~/stores';
import {changeUserDisplayThunk} from '~/apis/users/changeUserDisplay';
import {useCustomDispatch} from '~/hooks/stores/dispatch';

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
            style={styles.switch}
            onValueChange={onUserDisplaySwitchValueChange}
          />
        ),
      },
    ];
  }, [switchForDisplay, onUserDisplaySwitchValueChange]);

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        {list.map((l, i) => (
          <ListItem
            key={i}
            bottomDivider
            topDivider={i === 0 ? true : false}
            containerStyle={styles.listContainer}>
            <ListItem.Content>
              <ListItem.Title>{l.title}</ListItem.Title>
            </ListItem.Content>
            {l.switch && l.switch}
          </ListItem>
        ))}
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
  listContainer: {
    height: 45,
  },
  switch: {
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
  },
});
