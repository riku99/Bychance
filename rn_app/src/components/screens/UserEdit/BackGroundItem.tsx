import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

import {User} from '~/stores/user';
import {defaultTheme} from '~/theme';

type Props = {
  source: User['backGroundItem'];
  type: User['backGroundItemType'];
};

export const BackGroundItem = React.memo(({source, type}: Props) => {
  if (!source) {
    return <View style={styles.noneSoruce} />;
  }
  if (type === 'image') {
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
        ignoreSilentSwitch="obey"
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
    backgroundColor: defaultTheme.imageBackGroundColor,
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
