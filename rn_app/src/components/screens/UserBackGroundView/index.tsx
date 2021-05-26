import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import {RouteProp} from '@react-navigation/native';

import {WideRangeSourceContainer} from '~/components/utils/WideRangeSourceContainer';
import {RootStackParamList} from '~/screens/Root';
import {removeExtention} from '~/utils';

type Props = {
  route: RouteProp<RootStackParamList, 'UserBackGroundView'>;
};

export const UserBackGroundView = ({route}: Props) => {
  const {source, sourceType} = useMemo(() => route.params, [route.params]);

  const thumbnailUrl = useMemo(() => {
    const urlwithoutExt = removeExtention(source);
    return `${urlwithoutExt}_thumbnail.webp`;
  }, [source]);

  return (
    <View>
      <WideRangeSourceContainer>
        {sourceType === 'image' ? (
          <FastImage source={{uri: source}} style={styles.source} />
        ) : (
          <>
            <Video
              source={{uri: source}}
              style={[styles.source, styles.video]}
              repeat={true}
              poster={thumbnailUrl}
            />
            <FastImage source={{uri: thumbnailUrl}} style={styles.source} />
          </>
        )}
      </WideRangeSourceContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  source: {
    width: '100%',
    height: '100%',
  },
  video: {
    position: 'absolute',
    zIndex: 10,
  },
});
