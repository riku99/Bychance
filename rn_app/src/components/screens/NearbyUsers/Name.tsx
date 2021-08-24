import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '~/stores';
import {selectUserName} from '~/stores/_users';

type Props = {
  id: string;
  name: string;
};

export const Name = React.memo(({id, name}: Props) => {
  const storedName = useSelector((state: RootState) =>
    selectUserName(state, id),
  );

  const _name = storedName ? storedName : name;
  return <Text style={styles.name}>{_name}</Text>;
});

const styles = StyleSheet.create({
  name: {
    fontWeight: '500',
    fontSize: 15,
  },
});
