import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage, {FastImageProps} from 'react-native-fast-image';
import Video, {VideoProperties} from 'react-native-video';

import {useGetThumbnailUrl} from '~/hooks/video';

type Props = {
  video: VideoProperties & {source: {uri: string}};
  thumbnail?: Omit<FastImageProps, 'source'>;
};

export const VideoWithThumbnail = ({video, thumbnail}: Props) => {
  const thumbnailUrl = useGetThumbnailUrl(video.source.uri);
  return (
    <View>
      <Video style={[styles.source, styles.video]} {...video} />
      <FastImage
        source={{uri: thumbnailUrl}}
        style={styles.source}
        {...thumbnail}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  source: {
    width: '100%',
    height: '100%',
  },
  video: {
    position: 'absolute',
    zIndex: 10,
  },
});
