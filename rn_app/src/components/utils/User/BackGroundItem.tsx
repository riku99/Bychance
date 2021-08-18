import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

import {VideoWithThumbnail} from '~/components/utils/VideowithThumbnail';
import {SkeltonLoadingView} from '~/components/utils/SkeltonLoadingView';

type Props = {
  source: string | null;
  sourceType: 'image' | 'video' | null;
  onPress: () => void;
  videoPaused: boolean;
};

export const BackGroundItem = React.memo(
  ({source, sourceType, onPress, videoPaused}: Props) => {
    if (!source) {
      return null;
    }

    return (
      <>
        <SkeltonLoadingView />
        <TouchableOpacity
          style={styles.sourceContainer}
          onPress={onPress}
          activeOpacity={1}>
          {sourceType === 'image' ? (
            <FastImage source={{uri: source}} style={styles.sourceStyle} />
          ) : (
            <VideoWithThumbnail
              video={{
                source: {uri: source},
                resizeMode: 'cover',
                ignoreSilentSwitch: 'obey',
                paused: videoPaused,
              }}
            />
          )}
          <View style={styles.blurStyle} />
        </TouchableOpacity>
      </>
    );
  },
);

const styles = StyleSheet.create({
  sourceStyle: {
    width: '100%',
    height: '100%',
  },
  sourceContainer: {
    position: 'absolute',
    zIndex: 10,
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
