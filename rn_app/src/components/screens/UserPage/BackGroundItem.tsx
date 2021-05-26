import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

type Props = {
  source: string | null;
  sourceType: 'image' | 'video' | null;
  onPress: () => void;
  videoPaused: boolean;
};

export const BackGroundItem = React.memo(
  ({source, sourceType, onPress, videoPaused}: Props) => {
    if (!source) {
      return <View />;
    }

    if (sourceType === 'image') {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={1}>
          <FastImage source={{uri: source}} style={styles.sourceStyle} />
          <View style={styles.blurStyle} />
        </TouchableOpacity>
      );
    }

    if (sourceType === 'video') {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={1}>
          <Video
            source={{uri: source}}
            style={styles.sourceStyle}
            resizeMode="cover"
            ignoreSilentSwitch="obey"
            paused={videoPaused}
          />
        </TouchableOpacity>
      );
    }

    return <View />;
  },
);

const styles = StyleSheet.create({
  sourceStyle: {
    width: '100%',
    height: '100%',
  },
  blurStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.25,
  },
});
