import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

import {User} from '~/stores/user';
import {normalStyles} from '~/constants/styles/normal';

type Props = {
  source: string;
  type: User['backGroundItemType'];
};

export const BackGroundItem = React.memo(({source, type}: Props) => {
  if (source && type === 'image') {
    return (
      <>
        <FastImage source={{uri: source}} style={styles.source} />
      </>
    );
  } else {
    return (
      <Video
        source={{uri: source}}
        style={styles.source}
        repeat={true}
        resizeMode="cover"
      />
    );
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
  deleteButtonContainer: {
    position: 'absolute',
    right: 10,
    bottom: 5,
  },
  deleteButton: {
    backgroundColor: 'transparent',
  },
});
