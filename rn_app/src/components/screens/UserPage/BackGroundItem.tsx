import React from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

type Props = {
  source: string | null;
  sourceType: 'image' | 'video' | null;
};

export const BackGroundItem = React.memo(({source, sourceType}: Props) => {
  if (!source) {
    return <View />;
  }

  if (sourceType === 'image') {
    return (
      <View>
        <FastImage source={{uri: source}} style={styles.sourceStyle} />
        <View style={styles.blurStyle} />
      </View>
    );
  }

  if (sourceType === 'video') {
    return (
      <View>
        <Video
          source={{uri: source}}
          style={styles.sourceStyle}
          resizeMode="cover"
        />
      </View>
    );
  }

  return <View />;
});

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
