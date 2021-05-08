import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

import {User} from '~/stores/user';
import {normalStyles} from '~/constants/styles/normal';

type Props = {
  source: User['backGroundItem'];
  type: User['backGroundItemType'];
};

export const BackGroundItem = React.memo(({source, type}: Props) => {
  if (source && type === 'image') {
    return (
      <TouchableOpacity activeOpacity={1}>
        <FastImage source={{uri: source}} style={styles.source} />
      </TouchableOpacity>
    );
  } else {
    return <TouchableOpacity style={styles.noneSoruce} activeOpacity={1} />;
  }
});

const styles = StyleSheet.create({
  source: {
    width: '100%',
    height: '100%',
  },
  noneSoruce: {
    width: '100%',
    height: '100%',
    backgroundColor: normalStyles.imageBackGroundColor,
  },
});
