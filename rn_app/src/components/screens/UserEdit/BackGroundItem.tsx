import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

import {defaultTheme} from '~/theme';

type Props = {
  url: string | null;
  type: 'image' | 'video' | null;
};

export const BackGroundItem = React.memo(({url, type}: Props) => {
  if (!url) {
    return <View style={styles.noneSoruce} />;
  }
  if (type === 'image') {
    return (
      <>
        <FastImage source={{uri: url}} style={styles.source} />
      </>
    );
  } else {
    return (
      <Video
        source={{uri: url}}
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
